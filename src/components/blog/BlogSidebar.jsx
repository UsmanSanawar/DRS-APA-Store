// react
import React from 'react';

// third-party
import PropTypes from 'prop-types';

// widgets
import WidgetAboutus from '../widgets/WidgetAboutus';
import WidgetCategories from '../widgets/WidgetCategories';
import WidgetComments from '../widgets/WidgetComments';
import WidgetNewsletter from '../widgets/WidgetNewsletter';
import WidgetPosts from '../widgets/WidgetPosts';
import WidgetSearch from '../widgets/WidgetSearch';

export default function BlogSidebar(props) {
    const { position, posts, comments } = props;

    return (
        <div className={`block block-sidebar block-sidebar--position--${position}`}>
            <div className="block-sidebar__item">
                <WidgetSearch handleForm={props.handleForm} searchString={props.searchString} setSearch={props.setSearch} />
            </div>
            <div className="block-sidebar__item">
                <WidgetAboutus />
            </div>
            <div className="block-sidebar__item">
                <WidgetCategories setSelectedCat={props.setSelectedCat} selectedCat={props.selectedCat} categories={props.categories} />
            </div>
            <div className="block-sidebar__item">
                <WidgetPosts posts={posts.sort((a,b) => (a.approvedDate > b.approvedDate) ? 1 : ((b.approvedDate > a.approvedDate) ? -1 : 0)).slice(0, 3)} />
            </div>
            <div className="block-sidebar__item">
                <WidgetNewsletter />
            </div>
            <div className="block-sidebar__item">
                <WidgetComments comments={comments.slice(0, 5)} />
            </div>
        </div>
    );
}

BlogSidebar.propTypes = {
    /**
     * sidebar position (default: 'start')
     * one of ['start', 'end']
     * for LTR scripts "start" is "left" and "end" is "right"
     */
    position: PropTypes.oneOf(['start', 'end']),
};

BlogSidebar.defaultProps = {
    position: 'start',
};
