// export function amplifyMedia(mediaElem, multiplier) {
//   console.log("multpler", multiplier);
//   var context = new (window.AudioContext || window.webkitAudioContext)(),
//     result = {
//       context: context,
//       source: context.createMediaElementSource(mediaElem),
//       gain: context.createGain(),
//       media: mediaElem,
//       amplify: function (multiplier) {
//         result.gain.gain.value = multiplier;
//       },
//       getAmpLevel: function () {
//         return result.gain.gain.value;
//       },
//     };
//   let compressor = context.createDynamicsCompressor();
//   // You can tweak these values as per your requirement
//   compressor.threshold.value = -50;
//   compressor.knee.value = 40;
//   compressor.ratio.value = 12;
//   compressor.attack.value = 0;
//   compressor.release.value = 0.25;

//   result.source.connect(result.gain);
//   result.gain.connect(context.destination);

//   result.amplify(multiplier);
//   console.log("result", result);

//   return result;
// }

export const amplifyMedia = (mediaElement, volume, settingRef) => {
  if (!settingRef.current) {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const source = audioContext.createMediaElementSource(mediaElement);
    const gainNode = audioContext.createGain();

    gainNode.gain.value = volume; // Set the initial gain value based on volume

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    settingRef.current = { audioContext, gainNode, source };
  } else {
    settingRef.current.gainNode.gain.value = volume;
  }
};
