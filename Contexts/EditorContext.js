import { createContext, useContext, useState, useEffect } from "react";
import {
	EditorState,
	RichUtils,
	AtomicBlockUtils,
	CompositeDecorator,
	ContentState,
	convertToRaw,
	convertFromRaw,
	ContentBlock,
	DraftHandleValue,
	DraftEditorCommand,
	Modifier,
} from "draft-js";

import customStyleMap from "../utils/EditorUtils/EditorStyles/CustomStyleMap";

import getVideo from "../utils/EditorUtils/Media-urls";
const AppContext = createContext();
const api_url =
	process.env.NEXT_PUBLIC_DEVELOPMENT_API_URL ||
	process.env.NEXT_PUBLIC_PRODUCTION_API_URL;

import authHeader from "../services/auth-header";
import { useRouter } from "next/router";

export function EditorContext({ children }) {
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [promptForURL, setPromptForURL] = useState(false);
	const [URLValue, setURLValue] = useState("");
	const [URLType, setURLType] = useState("");
	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);
	const [isUnderline, setIsUnderline] = useState(false);
	const [color, setColor] = useState({
		background: "#fff",
	});
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [iconColor, setIconColor] = useState("");
	const [animateColor, setAnimateColor] = useState(false);
	const [loading, setIsLoading] = useState(false);
	const [isFontSize, setIsFontSize] = useState(false);
	const [active, setActive] = useState(false);
	const [okToDisplay, setOkToDisplay] = useState(false);
	const [clear, setClear] = useState(false);
	const [, setCurrentStyle] = useState({});
	const [promptForLink, setPromptForLink] = useState(false);
	const [warning, setWarning] = useState(false);
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	//const [date, setDate] = useState("")
	const [pageNumber, setPageNumber] = useState(1);
	//const [fontSizes, setFontSizes] = useState([fontSizeStyle]);
	const [currentColor, setCurrentColor] = useState("");
	//const [, setCustomStyleMap] = useState(customStyleMap);

	const [page, setPage] = useState(1);
	const [focusEditor, setFocusEditor] = useState(false);

	const [test, setTest] = useState(false);
	const [openFsDropdown, setOpenFsDropdown] = useState(false);

	const [openColorPicker, setOpenColorPicker] = useState(false);
	const [keywords, setKeywords] = useState("");
	const router = useRouter();

	const handleChoosePrimaryColor = (i) => {
		setSelectedIndex(i);
	};

	const handleChangeComplete = (colors, e) => {
		e.preventDefault();
		setColor({ background: colors.hex });
		//Object.assign(customStyleMap, { color_test: { color: colors.hex } })

		const selection = editorState.getSelection();

		// Let's just allow one color at a time. Turn off all active colors.
		/*const nextContentState = Object.keys(customStyleMap)
          .reduce((contentState, color) => {
    
            return Modifier.removeInlineStyle(contentState, selection, color)
          }, editorState.getCurrentContent());
    
    
        let nextEditorState = EditorState.push(
          editorState,
          nextContentState,
          'change-inline-style'
        );
    
        const currentStyle = editorState.getCurrentInlineStyle();
    
        // Unset style override for current color.
        if (!selection.isCollapsed()) {
      
          nextEditorState = currentStyle.reduce((state, color) => {
            console.log('COLRO', color)
            return RichUtils.toggleInlineStyle(state, color);
          }, nextEditorState);
        };
    
        // If the color is being toggled on, apply it.
        if (currentStyle.has(colors.hex)) {
          console.log('HAS?', colors.hex)
          nextEditorState = RichUtils.toggleInlineStyle(
            nextEditorState,
            { color_test: colors.hex }
          );
        }*/

		const newState = RichUtils.toggleInlineStyle(editorState, colors.hex);

		setEditorState(newState);
	};

	const link = (props) => {
		const { url } = props.contentState.getEntity(props.entityKey).getData();
		return <a href={url}>{props.children}</a>;
	};

	const findLinkEntities = (contentBlock, callback, contentState) => {
		contentBlock.findEntityRanges((character) => {
			const entityKey = character.getEntity();
			return (
				entityKey !== null &&
				contentState.getEntity(entityKey).getType() === "LINK"
			);
		}, callback);
	};

	const decorator = new CompositeDecorator([
		{
			strategy: findLinkEntities,
			component: link,
		},
	]);

	// Create the Editor whith either already input content (On page change or refresh we rerender with that) or no content stored in the localStorage.

	/*useEffect(() => {
		const content = sessionStorage.getItem("content");
		if (content) {
			const convertedContent = convertFromRaw(JSON.parse(content));
			setOkToDisplay(true);
			setEditorState(
				EditorState.createWithContent(convertedContent, decorator)
			);
		} else if (content === null) {
			setOkToDisplay(true);
			setEditorState(EditorState.createEmpty(decorator));
		}
	}, []);*/

	// store on sessionStorage

	const saveContent = (content) => {
		window.sessionStorage.setItem(
			"content",
			JSON.stringify(convertToRaw(content))
		);
	};
	const clearLocalStorage = () => {
		setClear(!clear);
		sessionStorage.clear();
		setEditorState(EditorState.createEmpty(decorator));
	};

	const postArticle = (e) => {
		//e.stopPropagation();
		e.preventDefault();
		setIsLoading(!loading);

		let contentState = editorState.getCurrentContent();
		let convertedContent = convertToRaw(contentState);

		fetch(`${api_url}/create-post`, {
			method: "POST",
			headers: authHeader(),
			body: JSON.stringify({
				title,
				description,
				category,
				convertedContent,
			}),
		})
			.then((res) => {
				console.log("res", res);
				return res.json();
			})
			.then((db) => {
				console.log("promises resolved", db);
				setIsLoading(false);
				router.push("/posts/1");
			})
			.catch((err) => {
				console.log(err);
			});
	};

	//OnChange, content is stored on the sessionStorage, editorState is updated.
	const onChange = (editorState) => {
		const contentState = editorState.getCurrentContent();
		const inlineStyle = editorState.getCurrentInlineStyle();
		const isBold = inlineStyle.has("BOLD");
		const isItalic = inlineStyle.has("ITALIC");
		const isUnderline = inlineStyle.has("UNDERLINE");

		//const isColorStyle = inlineStyle.has(colorStyle)

		//console.log('CONTENTSTATE', editorState)

		const selection = editorState.getSelection();
		/*const test = Object.keys(customStyleMap).reduce((contentState, color) => {

      return inlineStyle.has(color)

    })*/
		const colors = Object.values(customStyleMap);
		const getColors = colors.map((styles) => {
			if (inlineStyle.has(styles.color)) {
				return styles.color;
			}
		});

		getColors.map((color) => {
			if (color != undefined) {
				setIconColor(color);
			}
		});

		/*if (inlineStyle._map._map._root != undefined) {
      let arrayOfStyles = inlineStyle._map._map._root.entries

      arrayOfStyles.map(style => {
        if (style[0].charAt(0) === "#") {
          setIconColor(style[0])
        }
      })
    }*/

		saveContent(contentState);
		setEditorState(editorState);
		setCurrentStyle(inlineStyle);
		setIsBold(isBold);
		setIsItalic(isItalic);
		setIsUnderline(isUnderline);
	};

	const handleKeyCommand = (command, editorState) => {
		const newState = RichUtils.handleKeyCommand(editorState, command);
		if (newState) {
			onChange(newState);

			return "handled";
		}
		return "not-handled";
	};

	const toggleFontsize = (e, fontSize) => {
		e.preventDefault();
		const selection = editorState.getSelection();

		// allow one fontSize at a time. Turn off all active fontSizes.
		/*const nextContentState = Object.keys(customStyleMap)
          .reduce((contentState, fontSize) => {
            return Modifier.removeInlineStyle(contentState, selection, fontSize)
          }, editorState.getCurrentContent());*/
		const nextContentState = editorState.getCurrentContent();
		let nextEditorState = EditorState.push(
			editorState,
			nextContentState,
			"change-inline-style"
		);

		const currentStyle = editorState.getCurrentInlineStyle();

		// Unset style override for current fontSize.
		if (selection.isCollapsed()) {
			nextEditorState = currentStyle.reduce((state, fontSize) => {
				return RichUtils.toggleInlineStyle(state, fontSize);
			}, nextEditorState);
		}

		// If the fontSize is being toggled on, apply it.
		if (!currentStyle.has(fontSize)) {
			nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, fontSize);
		}

		onChange(RichUtils.toggleInlineStyle(editorState, fontSize));
		// onChange(nextEditorState);
		setOpenFsDropdown(!openFsDropdown);
	};

	const toggleTextColor = async (e, colorStyle) => {
		e.preventDefault();

		let max_array_length = 3;

		if (color.length < max_array_length) {
			color.unshift(colorStyle);
		} else if (color.length === max_array_length) {
			color.pop();
			color.unshift(colorStyle);
		}

		const selection = editorState.getSelection();

		// Let's just allow one color at a time. Turn off all active colors.
		/*const nextContentState = Object.keys(customStyleMap)
          .reduce((contentState, color) => {
            return Modifier.removeInlineStyle(contentState, selection, color)
          }, editorState.getCurrentContent());*/

		const nextContentState = editorState.getCurrentContent();

		let nextEditorState = EditorState.push(
			editorState,
			nextContentState,
			"change-inline-style"
		);

		const currentStyle = editorState.getCurrentInlineStyle();

		// Unset style override for current color.
		if (selection.isCollapsed()) {
			nextEditorState = currentStyle.reduce((state, color) => {
				return RichUtils.toggleInlineStyle(state, color);
			}, nextEditorState);
		}

		// If the color is being toggled on, apply it.
		if (!currentStyle.has(colorStyle)) {
			nextEditorState = RichUtils.toggleInlineStyle(
				nextEditorState,
				colorStyle
			);
		}

		//onChange(RichUtils.toggleInlineStyle(editorState, colorStyle))
		onChange(nextEditorState);
		setOpenColorPicker(!openColorPicker);
	};

	const toggleTextAlignement = (e, textAlignement) => {
		e.preventDefault();

		const selection = editorState.getSelection();

		// Let's just allow one color at a time. Turn off all active colors.
		/*const nextContentState = Object.keys(customStyleMap)
          .reduce((contentState, color) => {
            return Modifier.removeInlineStyle(contentState, selection, color)
          }, editorState.getCurrentContent());*/

		const nextContentState = editorState.getCurrentContent();

		let nextEditorState = EditorState.push(
			editorState,
			nextContentState,
			"change-inline-style"
		);

		const currentStyle = editorState.getCurrentInlineStyle();

		// Unset style override for current color.
		if (selection.isCollapsed()) {
			nextEditorState = currentStyle.reduce((state, textAlignement) => {
				return RichUtils.toggleInlineStyle(state, textAlignement);
			}, nextEditorState);
		}

		// If the color is being toggled on, apply it.
		if (!currentStyle.has(textAlignement)) {
			nextEditorState = RichUtils.toggleInlineStyle(
				nextEditorState,
				textAlignement
			);
		}

		onChange(RichUtils.toggleInlineStyle(editorState, "center"));
		//onChange(nextEditorState);
	};

	const toggleBold = (e) => {
		e.preventDefault();
		setIsBold(!isBold);
		onChange(RichUtils.toggleInlineStyle(editorState, "BOLD"));
	};

	const toggleItalic = (e) => {
		e.preventDefault();
		setIsItalic(!isItalic);
		onChange(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
	};

	const toggleUnderLine = (e) => {
		e.preventDefault();
		setIsUnderline(!isUnderline);
		onChange(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
	};

	const handleURL = (e) => {
		e.preventDefault();
		const { value } = e.target;
		setURLValue(value);
	};
	const addLink = () => {
		setEditorState(editorState);
		setPromptForLink(!promptForLink);

		const selection = editorState.getSelection();

		if (!selection.isCollapsed()) {
			setActive(!active);
			const contentState = editorState.getCurrentContent();
			const startKey = editorState.getSelection().getStartKey();
			const startOffset = editorState.getSelection().getStartOffset();
			const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
			const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

			let url = "";
			if (linkKey) {
				const linkInstance = contentState.getEntity(linkKey);
				url = linkInstance.getData().url;
			}
			setPromptForURL(!promptForURL);

			setURLValue(url);
		} else {
			setWarning(!warning);
			setOpen(!open);
		}
	};

	const confirmLink = () => {
		setEditorState(editorState);
		setURLValue(URLValue);
		const contentState = editorState.getCurrentContent();
		const contentStateWithEntity = contentState.createEntity(
			"LINK",
			"MUTABLE",
			{ url: URLValue }
		);

		const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

		const newEditorState = EditorState.set(editorState, {
			currentContent: contentStateWithEntity,
		});

		setEditorState(
			RichUtils.toggleLink(
				newEditorState,
				newEditorState.getSelection(),
				entityKey
			)
		);

		setPromptForURL(!promptForURL);
		setPromptForLink(!promptForLink);

		setActive(!active);
	};

	const promptForMedia = (type) => {
		setEditorState(editorState);
		setURLValue("");
		setURLType(type);
	};

	const addImage = () => {
		setPromptForURL(!promptForURL);
		setActive(!active);
		promptForMedia("image");
	};

	const addVideo = () => {
		setPromptForURL(!promptForURL);

		setActive(!active);
		promptForMedia("VIDEOTYPE");
	};

	const confirmMedia = (e) => {
		e.preventDefault();
		setEditorState(editorState);
		setURLValue(URLValue);
		setURLType(URLType);

		if (URLType === "VIDEOTYPE") {
			const getYouTubeId = getVideo.getYoutubeSrc(URLValue);

			const getVimeoId = getVideo.getVimeoSrc(URLValue);

			const contentState = editorState.getCurrentContent();
			let videoId = "";
			let src = "";

			if (!getYouTubeId && !getVimeoId) {
				return console.log("NOT VALID");
			}

			if (getYouTubeId && !getVimeoId) {
				src = "https://www.youtube.com/embed/";
				videoId = getYouTubeId.srcID;
			}

			if (getVimeoId && !getYouTubeId) {
				src = "https://player.vimeo.com/video/";
				videoId = getVimeoId.srcID;
			}

			const contentStateWithEntity = contentState.createEntity(
				URLType,
				"IMMUTABLE",
				{ src: src + videoId }
			);
			const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

			const newEditorState = EditorState.set(
				editorState,
				{ currentContent: contentStateWithEntity },
				"create-entity"
			);
			setEditorState(
				AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, "  ")
			);
		} else if (URLType === "image") {
			const contentState = editorState.getCurrentContent();
			const contentStateWithEntity = contentState.createEntity(
				URLType,
				"IMMUTABLE",
				{ src: URLValue }
			);

			const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
			const newEditorState = EditorState.set(
				editorState,
				{ currentContent: contentStateWithEntity },
				"create-entity"
			);
			setEditorState(
				AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ")
			);
		}

		setPromptForURL(!promptForURL);
		setActive(!active);
	};

	const handleClose = () => {
		setPromptForURL(!promptForURL);

		setActive(!active);
	};

	return (
		<AppContext.Provider
			value={{
				editorState,
				setEditorState,
				saveContent,
				onChange,
				clearLocalStorage,
				handleKeyCommand,
				okToDisplay,
				isBold,
				isItalic,
				isUnderline,
				toggleBold,
				toggleItalic,
				toggleUnderLine,
				promptForURL,
				handleURL,
				URLValue,
				addLink,
				confirmLink,
				addImage,
				addVideo,
				confirmMedia,
				handleClose,
				active,
				promptForLink,
				findLinkEntities,
				link,
				open,
				setOpen,
				postArticle,
				title,
				setTitle,
				description,
				setDescription,
				category,
				setCategory,

				toggleFontsize,

				focusEditor,
				toggleTextColor,
				handleChangeComplete,
				openFsDropdown,
				setOpenFsDropdown,
				openColorPicker,
				setOpenColorPicker,
				color,
				selectedIndex,
				setSelectedIndex,
				iconColor,
				toggleTextAlignement,
				handleChoosePrimaryColor,
				decorator,
				loading,
				keywords,
				setKeywords,
			}}>
			{children}
		</AppContext.Provider>
	);
}

export function useEditorContext() {
	return useContext(AppContext);
}
