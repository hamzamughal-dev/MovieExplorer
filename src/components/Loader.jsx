
const Loader = ({ text = "Loading...", className = "h-[300px]" }) => {
    return (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            <div className="w-[48px] h-[48px] rounded-full border-[4px] border-[#1e1e2e] border-t-[#01b4e4] animate-spin" />
            <p className="text-[#01b4e4] text-[16px]">{text}</p>
        </div>
    );
};

export default Loader;
