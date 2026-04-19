import React from 'react'

//Layout
import Default from '../layouts/dashboard/default';

// Dashboard
import AdminDashBoard from '../views/partials/admin-dashboard'
import UserDashBoard from '../views/partials/user-dashboard'

// user
import UserProfile from '../views/partials/app/user-profile';
import UserUpdate from '../views/partials/app/user-update';

//admin
import UserAdd from '../views/partials/admin/user-add';
import ActiveUserList from '../views/partials/admin/user-list-active';
import InactiveUserList from '../views/partials/admin/user-list-inactive';

// Date Entry Menu
import NoticeEntryNew from '../views/partials/notice/notice-entry';
import NoticeEntryFinal from '../views/partials/notice/notice-entry-auth';

// Date Entry Menu
import DateEntryNew from '../views/partials/date/date-entry';
import DateEntryFinal from '../views/partials/date/date-entry-auth';

// Fee Entry Menu
import FeeEntryNew from '../views/partials/fee/fee-entry';
import FeeEntryFinal from '../views/partials/fee/fee-entry-auth';

//Registration
import RegistrationCancell from '../views/partials/registration/registration-cancel'
import RegistrationFinalList from '../views/partials/registration/registration-final-list'
import RegistrationNew from '../views/partials/registration/registration-new'
import RegistrationTempList from '../views/partials/registration/registration-temp-list'
import RegistrationPayment from '../views/partials/registration/registration-payment'
import RegistrationArchiveList from '../views/partials/registration/registration-archive-list'
import RegistrationBreg from '../views/partials/registration/registration-search-breg'
import RegistrationGeneration from '../views/partials/registration/registration-number-generate'
import RegistrationAuth from '../views/partials/registration/registration-authorize'
import RegistrationUpdate from '../views/partials/registration/registration-update'

//Form Fillup
import FormFillupCancel from '../views/partials/form_fillup/form-fillup-cancel'
import FormFillupFinalList from '../views/partials/form_fillup/form-fillup-final-list'
import FormFillupNew from '../views/partials/form_fillup/form-fillup-new'
import FormFillupTempList from '../views/partials/form_fillup/form-fillup-temp-list'
import FormFillupPayment from '../views/partials/form_fillup/form-fillup-payment'
import FormFillupArchiveList from '../views/partials/form_fillup/form-fillup-archive-list'

//Transfer Certificate
import TcAuthorizedList from '../views/partials/tc/tc-authorized-list'
import TcPendingList from '../views/partials/tc/tc-pending-list'
import TcRejectedList from '../views/partials/tc/tc-rejected-list'
import TcArchiveList from '../views/partials/tc/tc-archive-list'

//Accounts Report
import SummeryReport from '../views/partials/accounts/summery_report'
import DetailsReport from '../views/partials/accounts/details_report'

//Print
import PrintAdmitCard from '../views/partials/print/print-admit-card'
import PrintInvoice from '../views/partials/print/print-invoice'
import PrintRegistrationCard from '../views/partials/print/print-registration-card'
import PrintTcOrder from '../views/partials/print/print-tc-order'

//Extra
import PrivacyPolicy from '../views/partials/extra/privacy-policy';
import TermsofService from '../views/partials/extra/terms-of-service';

// Institute Establishment Menu
import InstEstablishmentFinal from '../views/partials/institute/establishment-final-list';
import InstEstablishmentTemp from '../views/partials/institute/establishment-pending-list';
import InstEstablishmentReject from '../views/partials/institute/establishment-reject-list';
import InstEstablishmentProcess from '../views/partials/institute/establishment-process-list';
import InstEstablishmentInquiry from '../views/partials/institute/establishment-inquiry-list';
import InstEstablishmentOrder from '../views/partials/institute/establishment-order-generate';

// Institute Class Start Menu
import InstClassStartFinal from '../views/partials/institute/commencement-final-list';
import InstClassStartTemp from '../views/partials/institute/commencement-pending-list';
import InstClassStartReject from '../views/partials/institute/commencement-reject-list';
import InstClassStartProcess from '../views/partials/institute/commencement-process-list';
import InstClassStartInquiry from '../views/partials/institute/commencement-inquiry-list';
import InstClassStartOrder from '../views/partials/institute/commencement-order-generate';

// Institute Recognition Menu
import InstRecognitionNew from '../views/partials/institute/recognition-new';
import InstRecognitionListAll from '../views/partials/institute/recognition-all-list';
import InstRecognitionFinal from '../views/partials/institute/recognition-final-list';
import InstRecognitionTemp from '../views/partials/institute/recognition-pending-list';
import InstRecognitionReject from '../views/partials/institute/recognition-reject-list';
import InstRecognitionProcess from '../views/partials/institute/recognition-process-list';
import InstRecognitionInquiry from '../views/partials/institute/recognition-inquiry-list';
import InstRecognitionOrder from '../views/partials/institute/recognition-order-generate';

// Leave Application
import LeaveApp from '../views/partials/leave/leave-application';
import LeaveAppPending from '../views/partials/leave/leave-list-pending';
import LeaveAppReport from '../views/partials/leave/leave-list-report';
import LeaveAppApprove from '../views/partials/leave/leave-list-approve';
import LeaveAppAuthorized from '../views/partials/leave/leave-list-authorized';
import LeaveAppRejected from '../views/partials/leave/leave-list-rejected';
import LeaveAppPersonal from '../views/partials/leave/leave-list-personal';

// Passport NOC Application
import PassportApp from '../views/partials/passport/passport-application';
import PassportAppPending from '../views/partials/passport/passport-list-pending';
import PassportAppReport from '../views/partials/passport/passport-list-report';
import PassportAppProcess from '../views/partials/passport/passport-list-processing';
import PassportAppAuthorized from '../views/partials/passport/passport-list-authorized';
import PassportAppRejected from '../views/partials/passport/passport-list-rejected';
import PassportAppPersonal from '../views/partials/passport/passport-list-personal';

// Citizen Charter
import CitizenCharterAuthorized from '../views/partials/citizen-charter/citizen-charter-authorized';
import CitizenCharter from '../views/partials/citizen-charter/citizen-charter-new';
import CitizenCharterPending from '../views/partials/citizen-charter/citizen-charter-pending';
import CitizenCharterProcessing from '../views/partials/citizen-charter/citizen-charter-processing';
import CitizenCharterRejected from '../views/partials/citizen-charter/citizen-charter-rejected';
import CitizenCharterVerified from '../views/partials/citizen-charter/citizen-charter-verified';

// Registration Subject Update
import SubjectApp from '../views/partials/subjects/subject-entry-new';
import SubjectAppProcess from '../views/partials/subjects/subject-list-processing';
import SubjectAppAuthorized from '../views/partials/subjects/subject-list-authorized';
import SubjectAppRejected from '../views/partials/subjects/subject-list-rejected';

// Institute New Group Subject
import InstShiftsNew from '../views/partials/institute/inst-update-new';
import InstituteData from '../views/partials/institute/inst-data-list';
import InstituteUpdatePending from '../views/partials/institute/inst-update-list-pending';
import InstituteUpdateAuthorized from '../views/partials/institute/inst-update-list-authorized';
import InstituteUpdateRejected from '../views/partials/institute/inst-update-list-rejected';
import InstituteUpdateProcessing from '../views/partials/institute/inst-update-list-processing';

// Export
export const DefaultRouter = [
    {
        path: '/',
        element: <Default />,
        children: [
            // Dashboard
            {
                path: 'dashboard/admin',
                element: <AdminDashBoard />
            },
            {
                path: 'dashboard/home',
                element: <UserDashBoard />
            },

            // Profile Management
            {
                path: 'admin/user-profile',
                element: <UserProfile />
            },
            {
                path: 'admin/user-update',
                element: <UserUpdate />
            },

            // Leave Application
            {
                path: 'leave/application/new',
                element: <LeaveApp />
            },
            {
                path: 'leave/application/list/report',
                element: <LeaveAppReport />
            },
            {
                path: 'leave/application/list/approve',
                element: <LeaveAppApprove />
            },
            {
                path: 'leave/application/list/pending',
                element: <LeaveAppPending />
            },
            {
                path: 'leave/application/list/authorized',
                element: <LeaveAppAuthorized />
            },
            {
                path: 'leave/application/list/rejected',
                element: <LeaveAppRejected />
            },
            {
                path: 'leave/application/list/personal',
                element: <LeaveAppPersonal />
            },

            // Subject Entry
            {
                path: '/student/subject/new',
                element: <SubjectApp />
            },
            {
                path: '/student/subject/list/rejected',
                element: <SubjectAppRejected />
            },
            {
                path: '/student/subject/list/processing',
                element: <SubjectAppProcess />
            },
            {
                path: '/student/subject/list/authorized',
                element: <SubjectAppAuthorized />
            },

            // Passport NOC Application
            {
                path: 'passport/application/new',
                element: <PassportApp />
            },
            {
                path: 'passport/application/list/report',
                element: <PassportAppReport />
            },
            {
                path: 'passport/application/list/processing',
                element: <PassportAppProcess />
            },
            {
                path: 'passport/application/list/pending',
                element: <PassportAppPending />
            },
            {
                path: 'passport/application/list/authorized',
                element: <PassportAppAuthorized />
            },
            {
                path: 'passport/application/list/rejected',
                element: <PassportAppRejected />
            },
            {
                path: 'passport/application/list/personal',
                element: <PassportAppPersonal />
            },

            // Citizen Charter
            {
                path: 'citizen/charter/new',
                element: <CitizenCharter />
            },
            {
                path: 'citizen/charter/list/processing',
                element: <CitizenCharterProcessing />
            },
            {
                path: 'citizen/charter/list/pending',
                element: <CitizenCharterPending />
            },
            {
                path: 'citizen/charter/list/authorized',
                element: <CitizenCharterAuthorized />
            },
            {
                path: 'citizen/charter/list/rejected',
                element: <CitizenCharterRejected />
            },
            {
                path: 'citizen/charter/list/verified',
                element: <CitizenCharterVerified />
            },

            // User Management
            {
                path: 'admin/user-add',
                element: <UserAdd />
            },
            {
                path: 'admin/user-list/active',
                element: <ActiveUserList />
            },
            {
                path: 'admin/user-list/inactive',
                element: <InactiveUserList />
            },
            // {
            //     path: 'admin/permission-role',
            //     element: <UserPermission />
            // },

            // Public
            {
                path: 'user/privacy-policy/',
                element: <PrivacyPolicy />
            },
            {
                path: 'user/terms-of-service/',
                element: <TermsofService />
            },

            // Notice Entry Menu
            {
                path: '/entry/notice/new',
                element: <NoticeEntryNew />
            },
            {
                path: '/entry/notice/auth',
                element: <NoticeEntryFinal />
            },

            // Date Entry Menu
            {
                path: '/entry/date/new',
                element: <DateEntryNew />
            },
            {
                path: '/entry/date/auth',
                element: <DateEntryFinal />
            },

            // Fee Entry Menu
            {
                path: '/entry/fee/new',
                element: <FeeEntryNew />
            },
            {
                path: '/entry/fee/auth',
                element: <FeeEntryFinal />
            },

            // Registration Menu
            {
                path: 'student/registration/new',
                element: <RegistrationNew />
            },
            {
                path: 'student/registration/list/temp',
                element: <RegistrationTempList />
            },
            {
                path: 'student/registration/list/final',
                element: <RegistrationFinalList />
            },
            {
                path: 'student/registration/cancel',
                element: <RegistrationCancell />
            },
            {
                path: 'student/registration/payment',
                element: <RegistrationPayment />
            },
            {
                path: 'student/registration/list/archive',
                element: <RegistrationArchiveList />
            },
            {
                path: 'student/registration/search/birthreg',
                element: <RegistrationBreg />
            },
            {
                path: 'student/registration/number/generate',
                element: <RegistrationGeneration />
            },
            {
                path: 'student/registration/authorize',
                element: <RegistrationAuth />
            },
            {
                path: 'student/registration/update',
                element: <RegistrationUpdate />
            },

            //Form Fillup Menu
            {
                path: 'form-fillup/new',
                element: <FormFillupNew />
            },
            {
                path: 'form-fillup/list/temp',
                element: <FormFillupTempList />
            },
            {
                path: 'form-fillup/list/final',
                element: <FormFillupFinalList />
            },
            {
                path: 'form-fillup/cancel',
                element: <FormFillupCancel />
            },
            {
                path: 'form-fillup/payment',
                element: <FormFillupPayment />
            },
            {
                path: 'form-fillup/list/archive',
                element: <FormFillupArchiveList />
            },

            //Print
            {
                path: 'print/registration-card',
                element: <PrintRegistrationCard />
            },
            {
                path: 'print/admit-card',
                element: <PrintAdmitCard />
            },
            {
                path: 'print/tc-order',
                element: <PrintTcOrder />
            },
            {
                path: 'print/pay-slip',
                element: <PrintInvoice />
            },

            // Transfer Certificate Menu
            {
                path: 'student/tc/list/pending',
                element: <TcPendingList />
            },
            {
                path: 'student/tc/list/archive',
                element: <TcArchiveList />
            },
            {
                path: 'student/tc/list/authorized',
                element: <TcAuthorizedList />
            },
            {
                path: 'student/tc/list/rejected',
                element: <TcRejectedList />
            },

            // Institute Establishment Menu
            {
                path: 'establishment/pending-list',
                element: <InstEstablishmentTemp />
            },
            {
                path: 'establishment/authorized-list',
                element: <InstEstablishmentFinal />
            },
            {
                path: 'establishment/rejected-list',
                element: <InstEstablishmentReject />
            },
            {
                path: 'establishment/process-list',
                element: <InstEstablishmentProcess />
            },
            {
                path: 'establishment/inquiry-list',
                element: <InstEstablishmentInquiry />
            },
            {
                path: 'establishment/generate-order',
                element: <InstEstablishmentOrder />
            },

            // Institute Class Start Menu
            {
                path: 'class-start/pending-list',
                element: <InstClassStartTemp />
            },
            {
                path: 'class-start/authorized-list',
                element: <InstClassStartFinal />
            },
            {
                path: 'class-start/rejected-list',
                element: <InstClassStartReject />
            },
            {
                path: 'class-start/process-list',
                element: <InstClassStartProcess />
            },
            {
                path: 'class-start/inquiry-list',
                element: <InstClassStartInquiry />
            },
            {
                path: 'class-start/generate-order',
                element: <InstClassStartOrder />
            },

            // Institute Recognition Menu
            {
                path: 'institute/recognition/application',
                element: <InstRecognitionNew />
            },
            {
                path: 'institute/recognition/all-list',
                element: <InstRecognitionListAll />
            },
            {
                path: 'recognition/pending-list',
                element: <InstRecognitionTemp />
            },
            {
                path: 'recognition/authorized-list',
                element: <InstRecognitionFinal />
            },
            {
                path: 'recognition/rejected-list',
                element: <InstRecognitionReject />
            },
            {
                path: 'recognition/process-list',
                element: <InstRecognitionProcess />
            },
            {
                path: 'recognition/inquiry-list',
                element: <InstRecognitionInquiry />
            },
            {
                path: 'recognition/generate-order',
                element: <InstRecognitionOrder />
            },

            // Institute Group Subject Entry Menu
            {
                path: 'institute/data/update/new',
                element: <InstShiftsNew />
            },
            {
                path: 'institute/update/app/list',
                element: <InstituteData />
            },
            {
                path: 'institute/update/list/pending',
                element: <InstituteUpdatePending />
            },
            {
                path: 'institute/update/list/authorized',
                element: <InstituteUpdateAuthorized />
            },
            {
                path: 'institute/update/list/rejected',
                element: <InstituteUpdateRejected />
            },
            {
                path: 'institute/update/list/process',
                element: <InstituteUpdateProcessing />
            },

            // Accounts Menu
            {
                path: 'accounts/report/summery',
                element: <SummeryReport />
            },
            {
                path: 'accounts/report/details',
                element: <DetailsReport />
            }
        ]
    }
]
