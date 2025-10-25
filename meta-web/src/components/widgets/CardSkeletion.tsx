import type React from "react"
import Skeleton from "@/components/widgets/Skeletion"

const TweetCardSkeleton: React.FC = () => {
  return (
    <div className='tweetCardWrapper'>
      <div className='tweetCard'>
        {/* Header */}
        <div className='cardHeader'>
          <Skeleton variant="circle" width={40} height={40} />
          <div className='headerContent'>
            <Skeleton width={180} height={20} />
            <Skeleton width={120} height={16} />
          </div>
        </div>

        {/* Media */}
        <Skeleton height={200} />

        {/* Content */}
        <div className='cardContent'>
          <Skeleton width={250} height={28} />
          <Skeleton width="100%" height={80} />
        </div>

        {/* Actions */}
        <div className='cardActions'>
          <Skeleton variant="circle" width={40} height={40} />
          <Skeleton width={60} height={20} />
          <Skeleton variant="circle" width={40} height={40} />
        </div>
      </div>
    </div>
  );
}

export default TweetCardSkeleton

