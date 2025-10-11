import React from 'react';

interface TeamGroupProps {
  groupName: string;
  personNames: string[];
}

const TeamGroup: React.FC<TeamGroupProps> = ({ groupName, personNames }) => {
  return (
    <div className="bg-[var(--gray-4)] rounded-lg border-2 border-[var(--gray-4)] overflow-hidden">
      {/* 標題 */}
      <div className="text-center py-2 bg-[var(--gray-4)] border-2 border-[var(--gray-4)]">
        <h3 className="text-lg font-medium text-black">{groupName}</h3>
      </div>

      {/* 虛線框內容 */}
      <div className="bg-white px-3 py-5">
        <div className="grid grid-cols-2 gap-y-3 text-left">
          {personNames.map((name, index) => (
            <div key={index} className="text-black break-inside-avoid">
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamGroup;
