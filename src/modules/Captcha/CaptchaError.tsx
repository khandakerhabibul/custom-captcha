type Props = {
  remainingTimeToUnlock: number | null;
};

function CaptchaError({ remainingTimeToUnlock }: Props) {
  return (
    <div className='w-full h-screen flex justify-center items-center px-4'>
      <div
        className='
          p-8 sm:p-10 md:p-16 
          flex flex-col justify-center items-center text-center
          gap-8 sm:gap-10 
          backdrop-blur-[5px] bg-white/10 border border-white/20
          rounded-2xl 
          w-full sm:w-[90%] md:w-[75%] lg:w-[70%]
          max-w-3xl
        '
      >
        <h2 className='text-lg sm:text-xl md:text-2xl text-red-500 font-semibold'>
          Captcha validation failed!
        </h2>

        {remainingTimeToUnlock && remainingTimeToUnlock > 0 ? (
          <p className='text-sm sm:text-base'>
            Wait{' '}
            <span className='font-semibold text-red-500'>
              {remainingTimeToUnlock}
            </span>{' '}
            seconds and try again.
          </p>
        ) : (
          <p className='text-sm sm:text-base'>Try to reload now please.</p>
        )}
        {remainingTimeToUnlock === 0 && (
          <button
            onClick={() => {
              window.location.reload();
            }}
            className='
              w-auto bg-blue-500 hover:bg-blue-600 
              px-4 py-2 md:px-6 md:py-3 text-white text-sm sm:text-base 
              cursor-pointer rounded-md transition
            '
          >
            Reload!
          </button>
        )}
      </div>
    </div>
  );
}

export default CaptchaError;
