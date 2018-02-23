class domainList {
    constructor() {
        this.dependencies = ['page'];
        this.render = this.render.bind(this);
        this.remove = this.remove.bind(this);
    }

    render() {
        window.safe.getServices().then(names => {
            window.state.cachedDomains = names;
            let domainListHtml = '';

            names.map(function(domain) {
                let serviceListHtml = '';

                for (let i = 0; i < domain.services.length; i++) {
                    serviceListHtml += `<div class="service"><span class="subtle">safe://</span>` + domain.services[i].name + `.` + domain.name + `</div>`;
                }

                domainListHtml += `
                <div class="item" data-id="` + domain.name + `">
                    <div class="info"><span class="subtle">safe://</span>` + domain.name + (domain.services.length ? `` : `<div class="domain-warning">Add a service (subdomain)</div>`) + `</div>
                </div>
                <div class="item-sub" data-id="` + domain.name + `">
                    <div class="service-list">` + (serviceListHtml.length ? serviceListHtml : `No services`) + `</div>
                    <div class="service-actions"><div class="button">Create service</div></div>
                </div>`;
            });

            window.jquery('.page .content').html(
                `<div class="post-list domain-list">
                <div class="post-headings">
                    <div class="heading">Domain (public name)</div>
                </div>
                <div class="posts">
                    ` + (domainListHtml.length ? domainListHtml : `<div class="empty">No domains (public names)</div>`) + `
                </div>
            </div>
            <div class="post-actions">
                <div class="button">Create domain</div>
            </div>`
            );

            window.jquery('.post-actions .button').on('click', function () {
                window.jquery('.page .content').append(
                    `<div class="domain-modal">
                    <div class="domain-modal-inner">
                        <div class="domain-modal-close">&times;</div>
                        <label for="domain-title">Please enter a domain (public name)</label>
                        <input type="text" id="domain-title" placeholder="domain" />
                        <div class="protocol-overlay">safe://</div>
                        <div class="button">Create</div>
                    </div>
                </div>`
                );

                window.jquery('.domain-modal .button').on('click', function () {
                    window.jquery('.domain-modal .message').remove();
                    window.safe.createPublicName(window.jquery('.domain-modal input').val()).then(function (status) {
                        if (status) {
                            window.state.cachedDomains = [];
                            window.controller.renderView('domainList');
                        } else {
                            window.jquery('.domain-modal-inner').append('<div class="message">The domain you requested is already taken or your SafeCoin balance is too low to purchase it.</div>');
                        }
                    });
                });

                window.jquery('.domain-modal-inner .domain-modal-close').on('click', function(){
                    window.controller.renderView('domainList');
                });
            });

            window.jquery('.domain-list .item').on('click', function () {
                window.jquery('.item-sub[data-id="' + window.jquery(this).data('id') + '"]').toggleClass('active');
            });

            window.jquery('.service-actions .button').on('click', function () {
                let id = window.jquery(this).parents('.item-sub').data('id');

                window.jquery('.page .content').append(
                    `<div class="domain-modal service-modal">
                    <div class="domain-modal-inner">
                        <div class="domain-modal-close">&times;</div>
                        <label for="domain-title">Please enter a subdomain (service name)</label>
                        <input type="text" id="service-title" class="with-service" placeholder="service" />
                        <div class="protocol-overlay">safe://</div>
                        <div class="service-overlay">.` + id + `</div>
                        <div class="button">Create</div>
                    </div>
                </div>`
                );

                window.jquery('.service-modal .button').on('click', function () {
                    let serviceName = window.jquery('.service-modal input').val();

                    window.jquery('.service-modal .message').remove();
                    window.safe.createServiceFolder(id + '/root-' + serviceName).then(function (xorName) {
                        window.safe.createService(id, serviceName, xorName).then(function(status) {
                            if (status) {
                                window.state.cachedDomains = [];
                                window.controller.renderView('domainList');
                            } else {
                                window.jquery('.domain-modal-inner').append('<div class="message">The service you requested is already taken or your SafeCoin balance is too low to purchase it.</div>');
                            }
                        });
                    });
                });

                window.jquery('.domain-modal-inner .domain-modal-close').on('click', function(){
                    window.controller.renderView('domainList');
                });
            });
        });
    }

    remove() {
        window.jquery('.domain-modal-inner .domain-modal-close').off('click');
        window.jquery('.service-actions .button').off('click');
        window.jquery('.domain-modal .button').off('click');
        window.jquery('.page .content').remove('.domain-list, .post-actions');
    }
}

module.exports = new domainList;