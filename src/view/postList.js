class postList {
    constructor() {
        this.dependencies = ['page'];
        this.render = this.render.bind(this);
        this.remove = this.remove.bind(this);
    }

    render() {
        let postListHtml = '';

        window.state.posts.get('list').map(function(post) {
            let postStatusText = post.status === 1 ? 'Published' : (post.status === 2 ? 'Edited' : 'Draft');

            postListHtml += `<div class="item" data-id="` + post.id + `">
                <div class="info">` + post.title + `</div>
                <div class="info">` + post.lastModified + `</div>
                <div class="info">
                    <div class="tag-` + postStatusText.toLocaleLowerCase() + `">
                        ` + postStatusText + `
                    </div>
                </div>
            </div>`
        });

        window.jquery('.page .content').html(
            `<div class="post-list">
                <div class="post-headings">
                    <div class="heading">Title</div>
                    <div class="heading">Last modified</div>
                    <div class="heading">Status</div>
                </div>
                <div class="posts">
                    ` + (postListHtml.length ? postListHtml : `<div class="empty">No posts</div>`) + `
                </div>
            </div>
            <div class="post-actions">
                <div class="button">Create post</div>
            </div>`
        );

        window.jquery('.post-list .posts .item').on('click', function(){
            let id = window.jquery(this).data('id'),
                posts = window.state.posts.get('list');

            for (let i = 0; i < posts.length; i++) {
                if (posts[i].id === id) {
                    window.state.activePost = posts[i];
                }
            }

            if (window.state.activePost) {
                window.controller.renderView('postEdit');
            } else {
                alert('There was an error loading this post, please restart the app and try again');
            }
        });

        window.jquery('.post-actions .button').on('click', function(){
            window.state.activePost = false;
            window.controller.renderView('postEdit');
        });
    }

    remove() {
        window.jquery('.post-list .posts .item').off('click');
        window.jquery('.post-list .post-actions .button').off('click');
        window.jquery('.page .content').remove('.post-list, .post-actions');
    }
}

module.exports = new postList;