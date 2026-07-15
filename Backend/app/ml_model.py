import os
import joblib
import numpy as np
import torch
import torch.nn as nn
import logging
from app.config import settings
logger = logging.getLogger(__name__)
class StockLSTM(nn.Module):
    def __init__(self, input_dim=1, hidden_dim=64, num_layers=2):
        super(StockLSTM, self).__init__()
        self.hidden_dim = hidden_dim
        self.num_layers = num_layers
        self.lstm = nn.LSTM(input_dim, hidden_dim, num_layers, batch_first=True, dropout=0.2)
        self.fc = nn.Linear(hidden_dim, 1)
    def forward(self, x):
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_dim).to(x.device)
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_dim).to(x.device)
        out, _ = self.lstm(x, (h0, c0))
        return self.fc(out[:, -1, :]).squeeze(-1)
class PredictionModel:
    _model = None
    _scaler = None
    @classmethod
    def initialize(cls):
        if cls._model is None:
            if not os.path.exists(settings.MODEL_PATH):
                raise FileNotFoundError("File bobot model tidak ditemukan.")
            cls._model = StockLSTM()
            cls._model.load_state_dict(torch.load(settings.MODEL_PATH, map_location='cpu'))
            cls._model.eval()
            logger.info("Model ML loaded.")
        if cls._scaler is None:
            cls._scaler = joblib.load(settings.SCALER_PATH)
            logger.info("Scaler loaded.")
    @classmethod
    def predict_next_price(cls, historical_prices: list) -> float:
        cls.initialize()
        if len(historical_prices) < settings.SEQ_LEN:
            raise ValueError(f"Minimal {settings.SEQ_LEN} hari data diperlukan.")
        input_data = np.array(historical_prices[-settings.SEQ_LEN:]).reshape(-1, 1)
        scaled_data = cls._scaler.transform(input_data)
        tensor_input = torch.tensor(scaled_data, dtype=torch.float32).unsqueeze(0)
        with torch.no_grad():
            prediction = cls._model(tensor_input).numpy()
        actual = cls._scaler.inverse_transform(prediction.reshape(-1, 1))
        return round(float(actual[0][0]), 2)