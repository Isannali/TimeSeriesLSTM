from pydantic_settings import BaseSettings, SettingsConfigDict
class Settings(BaseSettings):
    APP_ENV: str
    REDIS_URL: str
    MODEL_PATH: str
    SCALER_PATH: str
    SEQ_LEN: int
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
settings = Settings()