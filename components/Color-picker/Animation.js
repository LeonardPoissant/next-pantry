import styled from "styled-components";

const Animation = (props) => {
	return (
		<>
			{props.isVisible ? (
				<Wrapper color={props.color}>Pick a color -{">"}</Wrapper>
			) : (
				<></>
			)}
		</>
	);
};

const Wrapper = styled.div`
	position: absolute;
	margin-top: 10px;
	color: ${(props) => (props.color != "white" ? props.color : "black")};
`;

export default Animation;
