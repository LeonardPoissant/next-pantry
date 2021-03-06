// @ts-nocheck

import React, { useState } from "react";
import { secondaries } from "../../utils/EditorUtils/EditorStyles/Inline-styles/Color-palette";
import styled from "styled-components";

const SecondaryPicker = (props) => {
	const secondaryKey = props.secondaryKey;
	const colors = secondaries[secondaryKey];
	const onToggle = props.onToggle;

	const isVisible = props.isVisible;

	return (
		<>
			{isVisible ? (
				<Wrapper isVisible={isVisible}>
					{colors.palettes.map((c, i) => (
						<ColorWrapper key={i}>
							<Color
								key={i}
								value={c.shade}
								style={{ backgroundColor: c.shade }}
								onMouseDown={(e) => onToggle(e, c.id)}
							/>
						</ColorWrapper>
					))}
				</Wrapper>
			) : (
				<></>
			)}
		</>
	);
};

export default SecondaryPicker;

const Wrapper = styled.div`
	position: absolute;
	margin-left: 300px;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
	width: 104px;
	margin-top: -10px;
`;

const Color = styled.div`
	border-radius: 60%;
	width: 15px;
	height: 15px;
	border: solid;
	border-width: 1px;
	cursor: pointer;
`;

const ColorWrapper = styled.div`
	padding: 2px;
`;
