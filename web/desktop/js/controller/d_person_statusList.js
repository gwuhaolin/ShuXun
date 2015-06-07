/**
 * Created by wuhaolin on 6/6/15.
 */
APP.controller('d_person_statusList', function (Status$) {
    Status$.loadUnreadStatusesCount();
    Status$.NewUsedBookStatus.load();
    Status$.NewNeedBookStatus.load();
    Status$.PrivateStatus.load();
    Status$.ReviewUsedBookStatus.load();
});
