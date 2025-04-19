import { Handle, Position } from '@xyflow/react';
 
const CustomNode = ({ data }) => {
    return (
        <div className="p-2 bg-white border rounded shadow-md text-sm text-center">
            <Handle type="target" position={Position.Top} id="top" />
            <div>{data.label}</div>
            <Handle type="source" position={Position.Bottom} id="bottom" />
        </div>
    );
};

export default CustomNode;