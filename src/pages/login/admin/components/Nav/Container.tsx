import {SortableContainer} from "react-sortable-hoc";

export const containerConfig = {
	axis: "y",
	useDragHandle: true,
	transitionDuration: 300,
};

export const Container = SortableContainer<any>(({children}) => (
	<div>{children}</div>
));