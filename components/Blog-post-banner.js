import { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";

const BlogPostBanner = (props) => {
	const [thumbnailCategory, setThumbnailCategory] = useState("");
	const router = useRouter();

	const codingThumbnail = "/coding.png";
	const randomThumbnail = "/random.jpg";
	const defaultThumbnail = "/default.png";

	useEffect(() => {
		setThumbnailCategory(props.category);
	}, []);

	const handleNavigation = () => {
		router.push(`/post/${props.id}/${props.title}`);
	};

	return (
		<li tabIndex={0}>
			<StyledLink
				href={{
					pathname: `/post/[id]/[title]`,
					query: {
						id: props.id,
						title: props.title,
					},
				}}>
				<Wrapper>
					<ThumbnailWrapper className="test">
						<Thumbnail
							src={
								thumbnailCategory === "random"
									? randomThumbnail
									: thumbnailCategory === "coding"
									? codingThumbnail
									: defaultThumbnail
							}
						/>
					</ThumbnailWrapper>
					<DetailsContainer className="details-container">
						<Title>{props.title}</Title>
						<Description>{props.description}</Description>
						<SubContainer>
							<Catgeroy>{props.category}</Catgeroy>
							<CreatedOn>{props.date}</CreatedOn>
						</SubContainer>
					</DetailsContainer>
				</Wrapper>
			</StyledLink>
		</li>
	);
};

export default BlogPostBanner;

const StyledLink = styled(Link)``;
const Wrapper = styled.a`
	cursor: pointer;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	width: 900px;
	height: 200px;
	margin-right: 0px;
	text-decoration: none;
	color: black;
	transition: width 1s, height 1s;
	background: /* gradient can be an image */ linear-gradient(
			0.25turn,
			#ff4b1f,
			#1fddff
		)
		left bottom no-repeat;
	background-size: 100% 2px;

	@media only screen and (min-width: 667px) {
		:hover {
			left: 0;
			width: 900px;
			height: 300px;
			cursor: pointer;
		}
		&:hover .test {
			transition: width 1s;
			width: 400px;

			background-color: white;
		}
		&:hover .details-container {
			transition: font-size 1s;
			font-size: 2rem;

			background-color: white;
			z-index: 3;
		}
	}
	@media only screen and (max-width: 667px) {
		width: 100%;
		padding: 19px;
	}
`;

const DetailsContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	text-decoration: none;
	transition: font-size 1s;
`;

const SubContainer = styled.div`
	display: flex;

	justify-content: space-between;
	width: 100%;
	margin-top: 95px;
`;

const ThumbnailWrapper = styled.div`
	width: 269px;
	transition: width 1s;
`;

const Thumbnail = styled.img`
	width: 100%;

	padding: 15px;
`;
const Title = styled.h3`
	margin: 0px;
`;

const Description = styled.div`
	padding: 6px 0px 6px 0px;
`;

const Catgeroy = styled.div`
	padding: 6px 0px 6px 0px;
`;

const CreatedOn = styled.div`
	padding: 3px;
`;
