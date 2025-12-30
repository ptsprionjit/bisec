import React from 'react'

// import { Switch, Route } from 'react-router-dom'
//Layout
import Default from '../layouts/dashboard/default';

// Dashboard
import Index from '../views/partials/index'
import IndexInstitute from '../views/partials/institute'

// user
import UserProfile from '../views/partials/app/user-profile';
import UserUpdate from '../views/partials/app/user-update';
// import UserPrivacySetting from '../views/partials/app/user-privacy-setting';

//admin
// import UserAdmin from '../views/partials/admin/admin';
// import UserPermission from '../views/partials/admin/user_permission';
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

// Export
export const DefaultRouter = [
    {
        path: '/',
        element: <Default />,
        children: [
            // Dashboard
            {
                path: 'dashboard',
                element: <Index />
            },
            {
                path: 'home',
                element: <IndexInstitute />
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
                path: 'registration/new-app',
                element: <RegistrationNew />
            },
            {
                path: 'registration/temp-list',
                element: <RegistrationTempList />
            },
            {
                path: 'registration/final-list',
                element: <RegistrationFinalList />
            },
            {
                path: 'registration/cancel-app',
                element: <RegistrationCancell />
            },
            {
                path: 'registration/payment',
                element: <RegistrationPayment />
            },
            {
                path: 'registration/archive-list',
                element: <RegistrationArchiveList />
            },
            {
                path: 'registration/search/breg',
                element: <RegistrationBreg />
            },
            {
                path: 'registration/number/generate',
                element: <RegistrationGeneration />
            },

            //Form Fillup Menu
            {
                path: 'form-fillup/new-app',
                element: <FormFillupNew />
            },
            {
                path: 'form-fillup/temp-list',
                element: <FormFillupTempList />
            },
            {
                path: 'form-fillup/final-list',
                element: <FormFillupFinalList />
            },
            {
                path: 'form-fillup/cancel-app',
                element: <FormFillupCancel />
            },
            {
                path: 'form-fillup/payment',
                element: <FormFillupPayment />
            },
            {
                path: 'form-fillup/archive-list',
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
                path: 'tc/pending-list',
                element: <TcPendingList />
            },
            {
                path: 'tc/archive-list',
                element: <TcArchiveList />
            },
            {
                path: 'tc/authorized-list',
                element: <TcAuthorizedList />
            },
            {
                path: 'tc/rejected-list',
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
