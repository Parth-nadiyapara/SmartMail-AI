from typing import List, Optional

from pydantic import BaseModel, Field


class EmailAnalysisResponse(BaseModel):
    summary: str = Field(min_length=1)

    priority: str = Field(
        pattern=r"^(Low|Medium|High)$"
    )

    category: str = Field(
        pattern=r"^(Work|Personal|Finance|Education|Social|Promotion|Security|Other)$"
    )

    urgencyScore: int = Field(
        ge=0,
        le=100
    )

    deadline: Optional[str] = None

    requiresReply: bool

    actionItems: List[str] = Field(
        default_factory=list
    )

    recommendations: List[str] = Field(
        default_factory=list
    )

    replySuggestion: Optional[str] = None