import {Tooltip, Icon} from "antd";

interface IArticleActionReleaseProps {
	state: "draft" | "release";
	
	onClick? (e: React.MouseEvent<HTMLElement>): void;
}

const titleHook = {
	draft: "发布",
	release: "存入草稿箱",
};

const typeHook = {
	draft: "notification",
	release: "book",
};

export const Release: React.SFC<IArticleActionReleaseProps> = ({
	                                                               state,
	                                                               onClick,
                                                               }) => (
	<Tooltip title={titleHook[state]}>
		<Icon
			type={typeHook[state]}
			onClick={onClick}
		/>
	</Tooltip>
);