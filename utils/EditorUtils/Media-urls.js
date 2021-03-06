const YOUTUBEMATCH_URL =
	/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
const VIMEOMATCH_URL =
	/https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;

export default {
	isYoutube: (url) => YOUTUBEMATCH_URL.test(url),
	isVimeo: (url) => VIMEOMATCH_URL.test(url),
	getYoutubeSrc: (url) => {
		let id = "";
		if (!url.match(YOUTUBEMATCH_URL) === undefined) {
			return console.log("NOT YOUTUBE");
		}
		//non null assertion
		if (url.match(YOUTUBEMATCH_URL) != null) {
			id = url && url.match(YOUTUBEMATCH_URL)[1];

			return {
				srcID: id,
				srcType: "youtube",
				url,
			};
		}
	},
	getVimeoSrc: (url) => {
		if (!url.match(VIMEOMATCH_URL)) {
			return;
		}
		//non null assertion
		const id = url.match(VIMEOMATCH_URL)[3];
		return {
			srcID: id,
			srcType: "vimeo",
			url,
		};
	},
};
