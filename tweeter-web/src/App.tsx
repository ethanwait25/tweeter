import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import useUserInfo from "./components/userInfo/UserInfoHook";
import { FolloweePresenter } from "./presenters/mainLayout/FolloweePresenter";
import { FollowerPresenter } from "./presenters/mainLayout/FollowerPresenter";
import { FeedPresenter } from "./presenters/mainLayout/FeedPresenter";
import { StoryPresenter } from "./presenters/mainLayout/StoryPresenter";
import ItemScroller from "./components/mainLayout/ItemScroller";
import { Status, User } from "tweeter-shared";
import { PagedItemView } from "./presenters/mainLayout/PagedItemPresenter";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route
          path="feed"
          element={
            <ItemScroller
              key={"feed-scroller"}
              presenterGenerator={(view: PagedItemView<Status>) =>
                new FeedPresenter(view)
              }
              itemComponentGenerator={(item: Status) => <StatusItem status={item} />}
            />
          }
        />
        <Route
          path="story"
          element={
            <ItemScroller
              key={"story-scroller"}
              presenterGenerator={(view: PagedItemView<Status>) =>
                new StoryPresenter(view)
              }
              itemComponentGenerator={(item: Status) => <StatusItem status={item} />}
            />
          }
        />
        <Route
          path="followees"
          element={
            <ItemScroller
              key={"followees-scroller"}
              presenterGenerator={(view: PagedItemView<User>) =>
                new FolloweePresenter(view)
              }
              itemComponentGenerator={(item: User) => <UserItem value={item} />}
            />
          }
        />
        <Route
          path="followers"
          element={
            <ItemScroller
              key={"followers-scroller"}
              presenterGenerator={(view: PagedItemView<User>) =>
                new FollowerPresenter(view)
              }
              itemComponentGenerator={(item: User) => <UserItem value={item} />}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
