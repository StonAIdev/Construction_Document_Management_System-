import React from 'react'
import Skeleton from "react-loading-skeleton";

function DrawerSkeleton() {
    return (
        <>
            <div className="usercard">
                <div className="cards">
                    <Skeleton count={4} />  <Skeleton height={100} />
                </div>
            </div>
            <div className="usercard">
                <div className="cards">
                    <Skeleton count={4} /> <Skeleton height={100} />
                </div>
            </div>
            <div className="usercard">
                <div className="cards">
                    <Skeleton count={4} /> <Skeleton height={100} />
                </div>
            </div>
            <div className="usercard">
                <div className="cards">
                    <Skeleton count={4} /> <Skeleton height={100} />
                </div>
            </div>
        </>
    )
}

export default DrawerSkeleton