from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    database_url: str = Field(..., env="DATABASE_URL")
    auth_service_url: str = Field(default="http://localhost:8001", env="AUTH_SERVICE_URL")

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
