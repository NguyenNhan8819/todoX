import React from "react";
const Footer = ({ completedTaskCount, activeTaskCount }) => {
  return (
    <div>
      {completedTaskCount + activeTaskCount > 0 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {completedTaskCount > 0 && (
              <>
                🎉Tuyệt vời! Bạn đã hoàn thành {completedTaskCount} việc{" "}
                {activeTaskCount > 0 &&
                  `và còn ${activeTaskCount} việc nữa thôi. Cố lên!`}
                .
              </>
            )}
            {completedTaskCount === 0 && activeTaskCount > 0 && (
              <>Hãy bắt đầu làm {activeTaskCount} nhiệm vụ nào!</>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default Footer;
