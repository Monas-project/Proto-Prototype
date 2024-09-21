export type ChildNodeInfo = {
  cid: string;
  sk?: string;
  fk?: string;
};

export type NodeMetadata = {
  name: string;
  owner_id: string;
  created_at: any;
  children: ChildNodeInfo[];
};

export type NodeData = {
  metadata: NodeMetadata;
  subfolder_key: string;
  root_id: string;
  file_data: any;
  children: NodeData[];
};
