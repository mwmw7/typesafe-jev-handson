// 🛩️ 개발자용 핸즈온: "레이더에 뭔가 잡혔다! 전투기를 띄워야 할까?"
//
// 관제실에 들어오는 짧은 보고를 Jev 에게 보여주고, 한 번의 호출로 세 가지를 동시에 묻는다.
//   1) 어떻게 할까?      → 출격 / 지켜보기 / 그냥 두기  (choice)
//   2) 얼마나 위험해?    → 0~3 단계                     (score)
//   3) 정체를 모르겠어?  → 예/아니오 확률               (noul)
// 그리고 최종 판단은 코드가 한다. Jev 는 "감" 을 숫자로 줄 뿐, 버튼은 사람이 누른다.
//
// 이 파일은 TypeSafe 모델 중 Jev 만 사용한다. (모든 데이터는 재미로 만든 가짜)
// 실행: TYPESAFE_API_KEY 설정 후 `npm start`

import { choice, noul, score, TypeSafeClient } from "@typesafe-ai/sdk";

const JEV_MODEL = "jev-latest"; // 특정 버전에 고정하려면 "jev-1.13.0"
const client = new TypeSafeClient({ defaultModel: JEV_MODEL });

// 관제실에 들어온 보고들 (전부 가짜, 그냥 재미로)
const reports = [
  "정체불명 비행체가 우리 쪽으로 빠르게 날아오고 있어요. 무전으로 불러도 대답이 없고, 방향도 안 바꿔요!",
  "옆 동네 여객기가 평소 다니던 길에서 조금 벗어났어요. 무전은 정상이고 '날씨 때문에 살짝 돌아간다'고 하네요.",
  "낮게 천천히 나는 작은 점이 하나 보여요. 새떼인지 드론인지 풍선인지 모르겠어요.",
  "옆 부대 훈련기예요. 아침에 미리 연락 온 대로 예정된 코스를 잘 날고 있고, 무전도 정상이에요.",
  "정체불명 비행체 두 대가 나란히 붙어서 우리 쪽으로 오고 있어요. 곧 경계선을 넘을 것 같아요.",
  "남녀가 지하철역 앞에서 싸우고 있다는 신고가 들어왔어요",
  "강아지가 잠을 자고 있어요"
];

for (const report of reports) {
  // 질문 세 개를 한 번에 보낸다. 세 질문은 서로의 답을 모른 채 각자 판단한다.
  const response = await client.systemOne({
    model: JEV_MODEL,
    state: { report },
    questions: {
      action: choice("`report`를 보고 관제실이 지금 뭘 해야 할까?", {
        scramble: "위험해 보인다. 전투기를 띄워서 직접 확인해야 한다",
        watch: "좀 수상하지만 아직은 지켜보면서 정보를 더 모으면 된다",
        ignore: "별일 아니다. 평소처럼 두면 된다",
      }),
      danger: score("`report`가 얼마나 위험해 보이나?", [
        "전혀 안 위험함, 심심한 하루",
        "조금 신경 쓰임",
        "꽤 수상함",
        "비상! 당장 뭔가 해야 함",
      ]),
      unknown: noul("`report`에 나온 것이 무엇인지 전혀 짐작이 안 가서 정체부터 알아내야 한다"),
    },
  });

  const { action, danger, unknown } = response.answers;
  const level = Math.round(danger.score); // 2.7 같은 소수가 오니까 반올림해서 단계로 읽는다

  // 여기부터는 코드가 결정한다. Jev 는 의견만 주고, 규칙은 우리가 정한다.
  let decision;
  if (action.confidence < 0.6) decision = "🤔 Jev 도 헷갈려함 → 사람이 한 번 더 확인";
  else if (action.choice === "scramble") decision = "🚀 출격 준비! (최종 버튼은 지휘관이)";
  else if (action.choice === "watch" && unknown.noul > 0.5) decision = "🔍 정체부터 알아보기 (레이더 확대, 무전 재시도)";
  else if (action.choice === "watch") decision = "👀 일단 지켜보기";
  else decision = "☕ 커피나 한 잔";

  console.log("\n📻 보고:", report);
  console.log("   Jev 의견 :", action.choice, `(확신 ${Math.round(action.confidence * 100)}%)`);
  console.log("   위험도   :", `${level}단계 - ${danger.legend[level]}`);
  console.log("   정체불명?:", `${Math.round(unknown.noul * 100)}% 그렇다`);
  console.log("   결정     :", decision);
}
