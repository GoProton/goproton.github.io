SharkGame.Gate = {
  tabId: "gate",
  tabDiscovered: !1,
  tabName: "Strange Gate",
  tabBg: "img/bg/bg-gate.png",
  discoverReq: { upgrade: ["gateDiscovery"] },
  message:
    "A foreboding circular structure, closed shut.<br/>There are many slots, and a sign you know to mean 'insert items here'.",
  messageOneSlot:
    "A foreboding circular structure, closed shut.<br/>One slot remains.",
  messageOpened:
    "A foreboding circular structure, wide open.<br/>The water glows and shimmers within it. A gentle tug pulls at you.",
  messagePaid: "The slot accepts your donation and ceases to be.",
  messageCantPay:
    "The slot spits everything back out. You get the sense it wants more at once.",
  messageAllPaid:
    "The last slot closes. The structure opens. The water glows and shimmers within it.<br/>A gentle tug pulls at you.",
  messageEnter: "You swim through the gate...",
  sceneClosedImage: "img/events/misc/scene-gate-closed.png",
  sceneAlmostOpenImage: "img/events/misc/scene-gate-one-slot.png",
  sceneOpenImage: "img/events/misc/scene-gate-open.png",
  costsMet: null,
  costs: null,
  init: function () {
    var e = SharkGame.Gate;
    (SharkGame.Tabs[e.tabId] = {
      id: e.tabId,
      name: e.tabName,
      discovered: e.tabDiscovered,
      discoverReq: e.discoverReq,
      code: e,
    }),
      (e.opened = !1);
  },
  createSlots: function (e, t, a) {
    var s = SharkGame.Gate;
    (s.costs = {}),
      $.each(e, function (e, n) {
        s.costs[e] = Math.floor(n * t * a);
      }),
      (s.costsMet = {}),
      $.each(s.costs, function (e, t) {
        s.costsMet[e] = !1;
      });
  },
  switchTo: function () {
    var e = SharkGame.Gate,
      t = $("#content");
    if (
      (t.append($("<div>").attr("id", "tabMessage")),
      t.append($("<div>").attr("id", "buttonList")),
      e.shouldBeOpen())
    )
      SharkGame.Button.makeButton(
        "gateEnter",
        "Enter gate",
        $("#buttonList"),
        e.onEnterButton,
      );
    else {
      var a = 0,
        s = $("#buttonList");
      $.each(e.costs, function (t, n) {
        if (!e.costsMet[t]) {
          var o = SharkGame.Resources.getResourceName(t);
          SharkGame.Button.makeButton(
            "gateCost-" + t,
            "Insert " + o + " into " + o + " slot",
            s,
            SharkGame.Gate.onGateButton,
          ),
            a++;
        }
      });
    }
    var n = e.shouldBeOpen()
        ? e.messageOpened
        : a > 1
          ? e.message
          : e.messageOneSlot,
      o = $("#tabMessage");
    SharkGame.Settings.current.showTabImages &&
      ((n =
        "<img width=400 height=200 src='" +
        e.getSceneImagePath() +
        "' id='tabSceneImageEssence'>" +
        n),
      o.css("background-image", "url('" + e.tabBg + "')")),
      o.html(n);
  },
  update: function () {},
  onGateButton: function () {
    var e = SharkGame.Gate,
      t = SharkGame.Resources,
      a = $(this).attr("id").split("-")[1],
      s = "",
      n = e.costs[a] * (SharkGame.Resources.getResource("numen") + 1);
    if (t.getResource(a) >= n)
      (SharkGame.Gate.costsMet[a] = !0),
        SharkGame.Resources.changeResource(a, -n),
        $(this).remove(),
        e.shouldBeOpen()
          ? ((s = e.messageAllPaid),
            SharkGame.Button.makeButton(
              "gateEnter",
              "Enter gate",
              $("#buttonList"),
              e.onEnterButton,
            ))
          : (s = e.messagePaid);
    else {
      s = e.messageCantPay + "<br/>";
      var o = n - t.getResource(a);
      s += SharkGame.Main.beautify(o) + " more.";
    }
    SharkGame.Settings.current.showTabImages &&
      (s =
        "<img width=400 height=200 src='" +
        e.getSceneImagePath() +
        "' id='tabSceneImageEssence'>" +
        s),
      $("#tabMessage").html(s);
  },
  onEnterButton: function () {
    $("#tabMessage").html(SharkGame.Gate.messageEnter),
      $(this).remove(),
      (SharkGame.wonGame = !0),
      SharkGame.Main.endGame();
  },
  shouldBeOpen: function () {
    var e = SharkGame.Gate,
      t = !0;
    return (
      $.each(e.costsMet, function (e, a) {
        t = t && a;
      }),
      t
    );
  },
  getSceneImagePath: function () {
    var e = SharkGame.Gate,
      t = 0;
    return (
      $.each(e.costsMet, function (e, a) {
        a && t++;
      }),
      (t = _.size(e.costs) - t),
      e.shouldBeOpen()
        ? e.sceneOpenImage
        : t > 1
          ? e.sceneClosedImage
          : e.sceneAlmostOpenImage
    );
  },
};
