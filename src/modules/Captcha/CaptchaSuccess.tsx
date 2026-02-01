function CaptchaSuccess() {
  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <div
        className='p-20 flex justify-center items-center backdrop-blur-[5px]
        bg-white/10 border border-white/20
          rounded-2xl shadow-2xl w-[70%]'
      >
        <h2 className='text-4xl text-green-500'>
          Captcha validation successful!
        </h2>
      </div>
    </div>
  );
}

export default CaptchaSuccess;
