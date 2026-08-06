interface CarImageProps {
  color: string;
}

const CarImage = ({ color }: CarImageProps) => {
  return (
    <svg
      width="40"
      height="20"
      viewBox="0 0 100 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 15L30 5H70L80 15H95V35H5V15H20Z"
        fill={color}
        stroke="black"
        strokeWidth="2"
      />
      <circle cx="25" cy="35" r="10" fill="black" />
      <circle cx="75" cy="35" r="10" fill="black" />
      <circle cx="25" cy="35" r="4" fill="white" />
      <circle cx="75" cy="35" r="4" fill="white" />
    </svg>
  );
};

export default CarImage;
