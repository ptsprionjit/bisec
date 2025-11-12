import { useState, useEffect, memo, Fragment } from "react";

//react-bootstrap
import { Offcanvas, Row, Col } from "react-bootstrap";

// Redux Selector / Action
import { useSelector } from "react-redux";

// Import selectors & action from setting store
import * as SettingSelector from "../../store/setting/selectors";

// Section Components
// Style Setting Section Components
import ThemeScheme from "./sections/theme-scheme";
// import ColorCustomizer from "./sections/color-customizer";
import MenuColor from "./sections/menu-color";
import MenuActiveStyle from "./sections/menu-active-style";
import NavbarStyle from "./sections/navbar-style";
// import MenuStyle from "./sections/menu-style";
// import CardStyle from "./sections/card-style";
// import FooterStyle from "./sections/footer-style";

const SettingOffCanvas = memo((props) => {
  const [show, setShow] = useState(false);

  // Define selectors
  // const appShortName = useSelector(SettingSelector.app_short_name);

  const themeScheme = useSelector(SettingSelector.theme_scheme);
  const themeSchemeDirection = useSelector(SettingSelector.theme_scheme_direction);
  const themeColor = useSelector(SettingSelector.theme_color);
  const headerNavbar = useSelector(SettingSelector.header_navbar);
  const sidebarColor = useSelector(SettingSelector.sidebar_color);
  const sidebarMenuStyle = useSelector(SettingSelector.sidebar_menu_style);

  // const footerType = useSelector(SettingSelector.footer);
  // const sidebarType = useSelector(SettingSelector.sidebar_type);
  // const cardStyle = useSelector(SettingSelector.card_style);

  useEffect(() => {
    const onClick = (e) => {
      if (show) {
        if (
          e.target.closest(".live-customizer") == null &&
          e.target.closest("#settingbutton") == null
        ) {
          setShow(false);
        }
      }
    };
    document.body.addEventListener("click", onClick);

    return () => {
      document.body.removeEventListener("click", onClick);
    };
  });

  return (
    <Fragment>
      <div
        className="btn btn-fixed-end btn-warning btn-icon btn-setting"
        onClick={(e) => {
          e.stopPropagation();
          setShow(true);
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animated-rotate"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /><circle cx="12" cy="12" r="3" /></svg>
      </div>

      <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        placement={`${themeSchemeDirection === "rtl" ? "start" : "end"}`}
        backdrop={false}
        scroll={true}
        className="live-customizer"
      >
        <Offcanvas.Header closeButton>
          <div className="d-flex justify-content-center align-items-center">
            <h3 className="offcanvas-title" id="live-customizer-label">
              Dashboard Settings
            </h3>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Row>
            <Col lg={12}>
              <div className="">
                {/*<div className="px-3 pt-3 text-center">
                  <h5 className="d-inline-block">Style Setting</h5>
                </div>*/}
                <div className="p-3">
                  <ThemeScheme
                    themeScheme={themeScheme}
                    themeSchemeDirection={themeSchemeDirection}
                    themeColor={themeColor}
                  ></ThemeScheme>

                  {props.name === true ? (
                    ""
                  ) : (
                    <Fragment>
                      <hr className="hr-horizontal" />
                      <MenuColor sidebarColor={sidebarColor}></MenuColor>

                      <hr className="hr-horizontal" />
                      {/* <MenuStyle sidebarType={sidebarType}></MenuStyle> */}
                      <hr className="hr-horizontal" />
                      <MenuActiveStyle
                        sidebarMenuStyle={sidebarMenuStyle}
                      ></MenuActiveStyle>

                      <hr className="hr-horizontal" />
                      <NavbarStyle headerNavbar={headerNavbar}></NavbarStyle>
                      {/* <CardStyle cardStyle={cardStyle}></CardStyle> */}
                      {/* <FooterStyle footerType={footerType}></FooterStyle> */}
                    </Fragment>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Offcanvas.Body>
      </Offcanvas>
    </Fragment>
  );
});

SettingOffCanvas.displayName = "SettingOffCanvas";
export default SettingOffCanvas;
