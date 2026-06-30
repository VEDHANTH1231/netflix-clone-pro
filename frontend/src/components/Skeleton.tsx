import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
  type: 'card' | 'text' | 'title' | 'hero';
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ type, style }) => {
  return (
    <div 
      className={`skeleton skeleton-${type}`} 
      style={style}
      role="progressbar"
      aria-busy="true"
    />
  );
};
export default Skeleton;
