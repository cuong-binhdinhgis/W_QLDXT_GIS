import QuanLyCSKDPage from '../pages/QuanLyCSKDPage';
import {APP_PATH} from '../constants';
export interface Route {
  id: string; name: string; component: any;
  props: { math?: boolean, exact?: boolean, path: string };
  avatar: string;
  isPrivate:boolean
}

const routes: Array<Route> = [
  {
    id: 'qlxt', name: 'Quản lý xả thải', component: QuanLyCSKDPage,
    props: { exact: true, path: APP_PATH.QuanLyKinhDoanh },
    avatar: '/images/icons/qlkd.png',
    isPrivate:true
  },
];
export default routes;