import React from 'react';

interface TeamGroupAddGroup {
  groupTitle: string;
  groupMembers: string[];
}

interface TeamGroupProps {
  groupName: string;
  personNames: string[];
  additionGroups: TeamGroupAddGroup[] | undefined;
}

const TeamGroup: React.FC<TeamGroupProps> = ({ groupName, personNames, additionGroups }) => {
  const beforeDecoLineClass =
    "before:mr-5 before:content-[''] before:h-[2px] before:bg-[var(--gray-3)] before:flex-1";
  const afterDecoLineClass =
    "after:ml-5 after:content-[''] after:h-[2px] after:bg-[var(--gray-3)] after:flex-1";

  return (
    <div className="bg-[var(--gray-4)] rounded-lg border-2 border-[var(--gray-4)] overflow-hidden">
      {/* 標題 */}
      {groupName && (
        <div className="text-center py-2 bg-[var(--gray-4)] border-2 border-[var(--gray-4)]">
          <h3 className="text-lg font-medium text-black">{groupName}</h3>
        </div>
      )}

      {/* 虛線框內容 */}
      <div className="bg-white px-3 py-5">
        <div className="grid grid-cols-2 gap-y-3 text-center">
          {personNames.map((name, index) => (
            <div key={index} className="text-black break-inside-avoid">
              {name}
            </div>
          ))}
        </div>

        {additionGroups &&
          additionGroups.map((group: TeamGroupAddGroup, index) => (
            <div key={`AddGroup${index}`}>
              <div
                className={`text-black mt-4 mb-3 justify-center flex items-center ${beforeDecoLineClass} ${afterDecoLineClass}`}
              >
                {group.groupTitle}
              </div>

              <div className="grid grid-cols-2 gap-y-3 text-center">
                {group.groupMembers.map((name, MemIndex) => (
                  <div key={`Title${index}_${MemIndex}`} className="text-black break-inside-avoid">
                    {name}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TeamGroup;
