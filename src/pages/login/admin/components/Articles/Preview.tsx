import {Preview as Pre} from "../Preview";

interface IArticlesPreviewProps {
	title: string;
	content: string;
	visible?: boolean;
	
	onCancel? (): void;
}

export const Preview: React.SFC<IArticlesPreviewProps> = ({
	                                                          title,
	                                                          content,
	                                                          visible,
	                                                          onCancel,
                                                          }) => (
	<Pre
		title={title}
		visible={visible}
		onCancel={onCancel}
	>
		<div
			className="admin-articles-preview-content"
			dangerouslySetInnerHTML={{__html: content}}
		/>
	</Pre>
);