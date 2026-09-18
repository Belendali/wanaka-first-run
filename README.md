# Wanaka · First run in Studio

A clickable 1:1 of Figma section **0917** (page “Plan Mode+新手流程”,
`PWtgAaGdl6znpuQykrnIbb`): a new player's first minute in Studio.

1. **Landing** — the idea is already typed; *Create* goes on.
2. **Login** — *Continue with Google*.
3. **Wana says hi** — waving, over a blurred studio; *Skip* or *Let's go*.
4. **Chat** and 5. **Scene** — each lit with a lime ring and a coachmark.
6. **The crew + Plan** — all five Wanas on stage, the Plan pill lit; *Start*.
7. **The Planner works alone** — the idea goes in with Plan mode on; the crew bar
   shows the Planner working and the others waiting (hover any cat to see what
   they will do).
8. **Plan ready** — a plan card with *View full plan*.
9. **Overview** — the plan over everything; genre and style open in place.
10. **Game assets** — four picks + *Generate later* per slot, multi-select. Hover
    pulls out a second row; *Browse more* opens the library in the slot with a
    search; nothing found offers *Generate later*.
11. **Build** — *Approve and build now*. One Wana at a time, five seconds each,
    and the game (drawn in code, `scene.js`) assembles: the Developer lays out
    collision boxes and a route, the Artist turns each box into its model, the
    Musician scores it, the Tester runs the kid through the course.
12. **Version 1.0** — a play button over the finished scene and in the chat.
13. **Play** — Preview mode: arrow keys / WASD or click the floor; five stars,
    then the hoop.

**Chats with different Wanas.** The *+* next to the chat name opens *New chat
with…*: Game (Wana, the default — the only chat that changes the game), Assets
(Artist Wana), Design (Planner Wana), Business (Publisher Wana). Chats run side
by side: the crew keeps building while the Artist makes a model in another chat.
The chat switcher shows who is working and who has news; assets go back with
*Add to scene*, design ideas with *Send to the Game chat*.

The shell, viewport, chat backdrop, landing and login are exports of the
Figma frames; everything that moves is drawn on top at frame coordinates.
The stage is the Figma frame (1920×1080) scaled to the window. The bar at the
bottom is for the demo — `?clean` hides it, `?step=1…8` opens any beat.

Run locally: `python3 serve.py` → http://localhost:8463
