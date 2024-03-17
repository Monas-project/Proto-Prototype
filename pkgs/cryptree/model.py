import datetime
from typing import Optional, Dict, List, Field
from pydantic import BaseModel
from datetime import datetime

class ChildNodeInfo(BaseModel):
    cid: str
    sk: bytes

class CryptTreeNodeModel(BaseModel):
    metadata: Dict
    subfolder_key: bytes

class Metadata(BaseModel):
    name: str
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.now)
    # parent_info: Optional[str] = None
    child_info: List[ChildNodeInfo] = []
    file_cid: Optional[str] = None  # ファイルCIDはファイルノードでのみ設定されます
    enc_file_key: Optional[bytes] = None  # ファイルノードでのみ設定されます

class GenerateRootNodeRequest(BaseModel):
    name: str
    owner_id: str
    isDirectory: bool
    signature: str

class CreateNodeRequest(BaseModel):
    name: str
    owner_id: str
    parent_cid: str
    subfolder_key: str = None  # 親ノードのサブフォルダキー。
    file_data: Optional[str] = None


class FetchNodeRequest(BaseModel):
    cid: str
    subfolder_key: str