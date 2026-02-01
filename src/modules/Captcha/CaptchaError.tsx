type Props = {
  remainingTimeToUnlock: number | null;
};

function CaptchaError({ remainingTimeToUnlock }: Props) {
  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <div
        className='p-20 flex flex-col gap-10 justify-center items-center backdrop-blur-[5px]
        bg-white/10 border border-white/20
          rounded-2xl shadow-2xl w-[70%]'
      >
        <h2 className='text-2xl text-red-500'>
          Captcha validation failed! Wait for {remainingTimeToUnlock} seconds
          and try again
        </h2>
        {remainingTimeToUnlock === 0 && (
          <button
            onClick={() => {
              window.location.reload();
            }}
            className='w-auto bg-blue-500 px-4 py-2 cursor-pointer rounded-sm'
          >
            Reload!
          </button>
        )}
      </div>
    </div>
  );
}

export default CaptchaError;
