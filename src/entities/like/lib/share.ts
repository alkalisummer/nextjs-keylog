export const facebookShare = (url: string) => {
  window.open(
    'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url),
    '_blank',
    'width=600,height=400',
  );
};

export const twitterShare = (url: string, postTitle: string) => {
  window.open(
    'http://twitter.com/share?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(postTitle),
    '_blank',
    'width=600,height=400',
  );
};
