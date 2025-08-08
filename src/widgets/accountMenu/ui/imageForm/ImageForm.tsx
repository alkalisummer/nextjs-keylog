'use client';

interface ImageFormProps {}

export const ImageForm = () => {
  return (
    <div>
      <input type="file" id="fileInput" accept="image/*" onChange={e => uploadImg(e)} />
    </div>
  );
};
