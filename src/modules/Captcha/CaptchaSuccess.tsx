function CaptchaSuccess() {
  return (
    <div className='w-full h-screen flex justify-center items-center px-4'>
      <div
        className='
          px-8 sm:px-10 md:px-16 
          py-12 md:py-16
          flex flex-col justify-center items-center text-center
          gap-8 sm:gap-10 
          backdrop-blur-[5px] bg-white/10 border border-white/20
          rounded-2xl 
          w-full sm:w-[90%] md:w-[75%] lg:w-[70%]
          max-w-3xl
        '
      >
        <h2 className='text-xl sm:text-2xl md:text-4xl text-green-500 font-semibold'>
          Captcha validation successful!
        </h2>
      </div>
    </div>
  );
}

export default CaptchaSuccess;
