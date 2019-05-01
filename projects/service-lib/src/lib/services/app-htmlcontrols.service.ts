import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { NotificationsService } from "./notifications.service";
import { APIUrls, UserSession } from "model-lib";
import { AuthService } from "./auth.service";
import * as $_ from "jquery";
const $ = $_;

@Injectable({
  providedIn: "root"
})
export class AppHtmlControlService {
  private userSession: UserSession;

  constructor(
    private notificationservice: NotificationsService,
    private authService: AuthService
  ) {}

  showDashboard() {
    this.userSession = this.authService.getUserLoggedIn();
    this.notificationservice.notify(
      "success",
      "Login Succesful",
      "Welcome " + this.userSession.fullName
    );
    $(function() {
      $("#main-wrapper").show();
      $("#routerlogin-div").hide();
    });
  }

  showSignupPage() {
    $(function() {
      $("#routerlogin-div").show();
    });
  }

  hideSignupPage() {
    $(function() {
      $("#routerlogin-div").show();
    });
  }

  hideDashboard() {
    $(function() {
      $("#main-wrapper").hide();
      $("#routerlogin-div").show();
    });
  }

  hideLoginOnly() {
    $(function() {
      $("#routerlogin-div").hide();
    });
  }

  showLoginOnly() {
    $(function() {
      $("#routerlogin-div").show();
    });
  }

  updateUserProfileBg(sel: any) {
    $(function() {
      var url = "url(" + APIUrls.GetCdnServer + "/logos/" + sel + ")";
      $("#userprofileid").css({ background: url });
      $("#userprofileid").css({ "background-size": "100%" });
    });
  }

  selectAppThemeOnControl(apptheme: string) {
    if (apptheme != "") {
      $("#themecolors li a").removeClass("working");
    }

    switch (apptheme) {
      case "default":
        $("#themecolors li:nth-child(2) a").addClass("working");
        break;
      case "green":
        $("#themecolors li:nth-child(3) a").addClass("working");
        break;
      case "red":
        $("#themecolors li:nth-child(4) a").addClass("working");
        break;
      case "blue":
        $("#themecolors li:nth-child(5) a").addClass("working");
        break;
      case "purple":
        $("#themecolors li:nth-child(6) a").addClass("working");
        break;
      case "megna":
        $("#themecolors li:nth-child(7) a").addClass("working");
        break;
      case "default-dark":
        $("#themecolors li:nth-child(9) a").addClass("working");
        break;
      case "green-dark":
        $("#themecolors li:nth-child(10) a").addClass("working");
        break;
      case "red-dark":
        $("#themecolors li:nth-child(11) a").addClass("working");
        break;
      case "blue-dark":
        $("#themecolors li:nth-child(12) a").addClass("working");
        break;
      case "purple-dark":
        $("#themecolors li:nth-child(13) a").addClass("working");
        break;
      case "megna-dark":
        $("#themecolors li:nth-child(14) a").addClass("working");
        break;
    }
  }

  loadAppTheme(apptheme: string) {
    if (apptheme != "") {
      $(function() {
        var themeUrl =
          APIUrls.GetCdnServer + "/css/colors/" + apptheme + ".css";
        $("#theme").attr({ href: themeUrl });
      });
    }

    if (apptheme != "") {
      $("#themecolors li a").removeClass("working");
    }

    switch (apptheme) {
      case "default":
        $("#themecolors li:nth-child(2) a").addClass("working");
        break;
      case "green":
        $("#themecolors li:nth-child(3) a").addClass("working");
        break;
      case "red":
        $("#themecolors li:nth-child(4) a").addClass("working");
        break;
      case "blue":
        $("#themecolors li:nth-child(5) a").addClass("working");
        break;
      case "purple":
        $("#themecolors li:nth-child(6) a").addClass("working");
        break;
      case "megna":
        $("#themecolors li:nth-child(7) a").addClass("working");
        break;
      case "default-dark":
        $("#themecolors li:nth-child(9) a").addClass("working");
        break;
      case "green-dark":
        $("#themecolors li:nth-child(10) a").addClass("working");
        break;
      case "red-dark":
        $("#themecolors li:nth-child(11) a").addClass("working");
        break;
      case "blue-dark":
        $("#themecolors li:nth-child(12) a").addClass("working");
        break;
      case "purple-dark":
        $("#themecolors li:nth-child(13) a").addClass("working");
        break;
      case "megna-dark":
        $("#themecolors li:nth-child(14) a").addClass("working");
        break;
    }
  }

  enableThemeSwitcher() {
    $(function() {
      // Theme color settings
      function store(name: any, val: any) {
        if (typeof Storage !== "undefined") {
          localStorage.setItem(name, val);
        } else {
          window.alert(
            "Please use a modern browser to properly view this template!"
          );
        }
      }
      $(document).ready(function() {
        $("*[data-theme]").click(function(e) {
          e.preventDefault();
          var currentStyle = $(this).attr("data-theme");
          store("theme", currentStyle);
          var themeUrl =
            APIUrls.GetCdnServer + "/css/colors/" + currentStyle + ".css";
          $("#theme").attr({ href: themeUrl });
        });

        var currentTheme = get("theme");
        if (currentTheme != null) {
          var themeUrl =
            APIUrls.GetCdnServer + "/css/colors/" + currentTheme + ".css";
          $("#theme").attr({ href: themeUrl });
        }
        // color selector
        $("#themecolors").on("click", "a", function() {
          $("#themecolors li a").removeClass("working");
          $(this).addClass("working");
        });
      });

      function get(name: any) {}
    });
  }
}
