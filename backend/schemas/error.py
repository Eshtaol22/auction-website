from pydantic import BaseModel
from typing import Optional

# Define a standard structure for an error response
class APIErrorResponse(BaseModel):
    detail: str
    code: Optional[str] = None