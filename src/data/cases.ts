import { CaseData } from "@/types";

export const CASES: CaseData[] = [
  {
    id: 1,
    title: "深覆合伴早接触",
    difficulty: "easy",
    patientInfo: {
      age: "28岁",
      gender: "女",
      occupation: "小学教师",
    },
    chiefComplaint: "上前牙不美观，有时咬东西时前牙不舒服，最近感觉大牙有点酸软。",
    intraoralDescription:
      "恒牙列，口腔卫生状况良好。上颌前牙略向唇侧倾斜，下前牙排列整齐。闭口时观察上前牙覆盖下前牙超过2/3。11、21牙舌侧可见磨损痕迹，36、46牙合面有充填体，边缘密合。牙龈色泽正常，无明显红肿出血。",
    occlusalClues: [
      "嘱患者做正中咬合时，可见下前牙咬至上前牙腭侧黏膜附近",
      "用咬合纸检查，11牙舌侧有明显的早接触点",
      "前牙区覆合深度约为下牙冠高度的3/4",
    ],
    correctSequence: ["centric", "protrusive", "lateral", "findings"],
    sequencePoints: 40,
    requiredFindings: [
      {
        id: "f1-1",
        name: "深覆合Ⅲ度",
        category: "deepOverbite",
        description: "上前牙覆盖下前牙唇面超过2/3，属于深覆合Ⅲ度",
        points: 20,
      },
      {
        id: "f1-2",
        name: "11牙舌侧早接触",
        category: "earlyContact",
        description: "正中咬合时11牙舌侧有明显咬合印记，为早接触点",
        points: 20,
      },
      {
        id: "f1-3",
        name: "前牙舌侧磨损",
        category: "other",
        description: "11、21牙舌侧可见磨损痕迹，与长期深覆合咬合创伤有关",
        points: 10,
      },
    ],
    decoyFindings: [
      {
        id: "d1-1",
        name: "前牙反合",
        category: "crossBite",
        description: "下前牙位于上前牙唇侧，为前牙反合",
        points: 0,
      },
      {
        id: "d1-2",
        name: "偏侧咀嚼习惯",
        category: "unilateralChewing",
        description: "患者长期只用一侧咀嚼食物",
        points: 0,
      },
      {
        id: "d1-3",
        name: "后牙反合",
        category: "crossBite",
        description: "一侧后牙上颌牙齿位于下颌牙齿舌侧",
        points: 0,
      },
    ],
    dialoguePrompts: [
      {
        trigger: "centric_done",
        text: "请问您咬东西的时候，有没有感觉某颗牙先碰到，不舒服或者疼痛？",
      },
      {
        trigger: "deepOverbite_found",
        text: "您平时有没有不自觉地咬紧牙关或者磨牙的情况？",
      },
      {
        trigger: "earlyContact_found",
        text: "最近有没有感觉这颗牙齿吃东西时特别酸或者不敢用力？",
      },
    ],
    standardSummary:
      "患者28岁女性，因上前牙美观及咬合不适就诊。口腔检查见深覆合Ⅲ度（上前牙覆盖下前牙超过2/3），正中咬合时11牙舌侧有明显早接触，11、21牙舌侧可见磨损痕迹。咬合检查顺序：正中咬合→前伸运动→侧方运动。建议：1. 拍摄全景片及头影测量片，评估牙槽骨及颌骨关系；2. 考虑正畸治疗改善深覆合；3. 对11牙早接触点进行适当调合；4. 定期复查，观察牙齿磨损情况。",
  },
  {
    id: 2,
    title: "单侧反合",
    difficulty: "easy",
    patientInfo: {
      age: "16岁",
      gender: "男",
      occupation: "学生",
    },
    chiefComplaint: "家长发现孩子牙齿不齐，吃东西总用右边，左边咬不动，担心影响脸型。",
    intraoralDescription:
      "混合牙列末期，恒牙已基本萌出。右侧后牙区咬合关系尚可，左侧后牙区可见上颌后牙位于下颌后牙舌侧。面部观察左右略有不对称，左侧咬肌相对不丰满。张口度正常，开口型无明显偏斜。口腔卫生一般，左下后牙有少量软垢。",
    occlusalClues: [
      "嘱患者做正中咬合，左侧后牙区上颌牙舌尖位于下颌牙颊尖舌侧",
      "嘱患者做左侧方运动，可见左侧后牙有明显咬合干扰",
      "询问患者，承认长期只用右侧咀嚼，左边咬东西使不上劲",
    ],
    correctSequence: ["centric", "lateral", "protrusive", "findings"],
    sequencePoints: 40,
    requiredFindings: [
      {
        id: "f2-1",
        name: "左侧后牙反合",
        category: "crossBite",
        description: "左侧上下后牙正中咬合时，上颌后牙位于下颌后牙舌侧，为后牙反合",
        points: 20,
      },
      {
        id: "f2-2",
        name: "偏侧咀嚼习惯",
        category: "unilateralChewing",
        description: "患者长期使用右侧咀嚼，左侧咀嚼功能较弱，为偏侧咀嚼习惯",
        points: 20,
      },
      {
        id: "f2-3",
        name: "左侧方运动咬合干扰",
        category: "earlyContact",
        description: "做左侧方运动时，左侧反合牙区有明显咬合干扰",
        points: 10,
      },
    ],
    decoyFindings: [
      {
        id: "d2-1",
        name: "深覆合",
        category: "deepOverbite",
        description: "上前牙覆盖下前牙唇面超过1/3",
        points: 0,
      },
      {
        id: "d2-2",
        name: "前伸咬合干扰",
        category: "earlyContact",
        description: "前伸运动时后牙区有早接触",
        points: 0,
      },
      {
        id: "d2-3",
        name: "前牙反合",
        category: "crossBite",
        description: "下前牙位于上前牙前方",
        points: 0,
      },
    ],
    dialoguePrompts: [
      {
        trigger: "centric_done",
        text: "请问您平时吃东西是两边一起嚼，还是习惯用某一边？",
      },
      {
        trigger: "crossBite_found",
        text: "最近是否总用右侧吃饭？有没有觉得左边咬东西使不上劲？",
      },
      {
        trigger: "unilateralChewing_found",
        text: "您发现这种情况有多久了？有没有哪边关节不舒服？",
      },
    ],
    standardSummary:
      "患者16岁男性，因牙齿不齐及偏侧咀嚼就诊。口腔检查见左侧后牙反合（上颌后牙位于下颌后牙舌侧），左侧方运动时反合牙区有咬合干扰。患者有明显的右侧偏侧咀嚼习惯，面部左右略有不对称。咬合检查顺序：正中咬合→侧方运动→前伸运动。建议：1. 拍摄全景片及头颅侧位片，全面评估牙颌情况；2. 建议正畸治疗矫正后牙反合，建立正常咬合关系；3. 指导患者有意识地双侧交替咀嚼，改善偏侧咀嚼习惯；4. 定期口腔检查及牙周维护。",
  },
  {
    id: 3,
    title: "前伸咬合干扰",
    difficulty: "medium",
    patientInfo: {
      age: "35岁",
      gender: "女",
      occupation: "公司职员",
    },
    chiefComplaint: "近三个月来前牙咬东西时不舒服，尤其是咬住再往前伸的时候，感觉前牙被顶着，大牙咬不上。",
    intraoralDescription:
      "恒牙列完整，口腔卫生良好。上下前牙排列基本整齐，覆合覆盖基本正常。22牙形态略小，42牙切缘有少量磨耗。后牙区可见36、46银汞充填体，边缘尚可。牙龈无明显红肿，牙周探诊深度正常。",
    occlusalClues: [
      "正中咬合基本稳定，后牙广泛接触",
      "嘱患者做前伸运动，下前牙向前滑动时，22-42区有明显的先接触点",
      "前伸至前牙对刃位时，后牙完全无接触",
      "用咬合纸在前伸位检查，22舌侧和42切端有明显印记",
    ],
    correctSequence: ["centric", "protrusive", "lateral", "findings"],
    sequencePoints: 40,
    requiredFindings: [
      {
        id: "f3-1",
        name: "前伸咬合干扰",
        category: "earlyContact",
        description: "前伸运动时22-42区有早接触，导致后牙分离，为前伸咬合干扰",
        points: 25,
      },
      {
        id: "f3-2",
        name: "42牙切缘磨耗",
        category: "other",
        description: "42牙切缘可见磨耗痕迹，与长期前伸咬合创伤有关",
        points: 15,
      },
      {
        id: "f3-3",
        name: "前伸位后牙无接触",
        category: "other",
        description: "前伸至对刃位时，双侧后牙完全无咬合接触，属于正常前伸引导型",
        points: 10,
      },
    ],
    decoyFindings: [
      {
        id: "d3-1",
        name: "深覆合",
        category: "deepOverbite",
        description: "上前牙覆盖下前牙超过2/3",
        points: 0,
      },
      {
        id: "d3-2",
        name: "后牙反合",
        category: "crossBite",
        description: "一侧后牙反合",
        points: 0,
      },
      {
        id: "d3-3",
        name: "偏侧咀嚼习惯",
        category: "unilateralChewing",
        description: "患者有偏侧咀嚼习惯",
        points: 0,
      },
    ],
    dialoguePrompts: [
      {
        trigger: "centric_done",
        text: "请问您在咬东西往前伸的时候，有没有感觉前牙被顶住或者不舒服？",
      },
      {
        trigger: "protrusive_done",
        text: "您有没有注意到往前伸下巴的时候，前面牙先碰到，后面牙咬不上？",
      },
      {
        trigger: "earlyContact_found",
        text: "这种情况出现多久了？有没有晨起时关节酸胀的感觉？",
      },
    ],
    standardSummary:
      "患者35岁女性，因前伸咬合不适三个月就诊。口腔检查见正中咬合基本稳定，但前伸运动时22-42区有明显早接触，导致前伸位后牙完全无接触，存在前伸咬合干扰。42牙切缘可见磨耗痕迹。咬合检查顺序：正中咬合→前伸运动→侧方运动。建议：1. 详细检查颞下颌关节，排除关节紊乱；2. 对22-42区前伸咬合干扰点进行精细调合；3. 建议制作夜磨牙垫，保护牙齿避免进一步磨耗；4. 嘱患者避免大张口及咬硬物，定期复查。",
  },
  {
    id: 4,
    title: "复杂咬合异常",
    difficulty: "medium",
    patientInfo: {
      age: "42岁",
      gender: "男",
      occupation: "公务员",
    },
    chiefComplaint: "牙齿不齐多年，近期感觉咬合越来越不舒服，吃东西时多处牙酸痛，张口偶尔有弹响。",
    intraoralDescription:
      "恒牙列，牙列拥挤不齐。上前牙明显前突，下前牙舌倾，覆盖约8mm，覆合约70%。右侧后牙区上颌后牙位于下颌后牙舌侧。17、27、37、47牙面均有不同程度磨耗。口腔卫生一般，牙龈有轻度炎症。",
    occlusalClues: [
      "正中咬合时下前牙咬至上前牙舌侧牙龈组织，11、21牙舌侧有明显咬合印记",
      "右侧后牙区正中咬合时反合，上颌后牙舌尖位于下颌后牙颊尖舌侧",
      "前伸运动时前牙区有多处早接触点，后牙分离不完全",
      "侧方运动时双侧后牙均有不同程度干扰，工作侧与非工作侧均有接触",
    ],
    correctSequence: ["centric", "protrusive", "lateral", "findings"],
    sequencePoints: 40,
    requiredFindings: [
      {
        id: "f4-1",
        name: "深覆合伴深覆盖",
        category: "deepOverbite",
        description: "上前牙覆盖下前牙约70%（深覆合），水平覆盖约8mm（深覆盖）",
        points: 15,
      },
      {
        id: "f4-2",
        name: "右侧后牙反合",
        category: "crossBite",
        description: "右侧后牙区正中咬合时上颌后牙位于下颌后牙舌侧，为后牙反合",
        points: 15,
      },
      {
        id: "f4-3",
        name: "前牙区早接触",
        category: "earlyContact",
        description: "正中咬合时11、21牙舌侧有明显早接触印记",
        points: 10,
      },
      {
        id: "f4-4",
        name: "前伸及侧方咬合干扰",
        category: "earlyContact",
        description: "前伸运动和侧方运动时均存在多处咬合干扰点",
        points: 10,
      },
    ],
    decoyFindings: [
      {
        id: "d4-1",
        name: "前牙反合",
        category: "crossBite",
        description: "下前牙位于上前牙前方",
        points: 0,
      },
      {
        id: "d4-2",
        name: "左侧后牙反合",
        category: "crossBite",
        description: "左侧后牙区反合",
        points: 0,
      },
      {
        id: "d4-3",
        name: "开颌",
        category: "other",
        description: "正中咬合时前牙无接触",
        points: 0,
      },
    ],
    dialoguePrompts: [
      {
        trigger: "centric_done",
        text: "请问您有没有感觉到闭嘴时前面的牙先碰到，后面的牙咬不上？",
      },
      {
        trigger: "deepOverbite_found",
        text: "您有没有注意到上牙越来越突出，下牙被上牙盖住很多？",
      },
      {
        trigger: "crossBite_found",
        text: "平时吃饭有没有觉得右边牙齿咬东西使不上劲？",
      },
      {
        trigger: "earlyContact_found",
        text: "张口或闭口的时候耳朵前面有没有弹响或者疼痛？",
      },
    ],
    standardSummary:
      "患者42岁男性，因咬合不适及牙列不齐多年就诊。口腔检查见复杂咬合异常：1. 深覆合伴深覆盖（覆合70%，覆盖8mm）；2. 右侧后牙反合；3. 前牙区正中咬合早接触（11、21牙舌侧）；4. 前伸及侧方运动存在多处咬合干扰。多颗磨牙牙合面可见磨耗痕迹。咬合检查顺序：正中咬合→前伸运动→侧方运动。建议：1. 拍摄全景片、头影测量片及颞下颌关节CBCT，全面评估；2. 建议正畸正颌联合治疗，彻底改善咬合关系及面型；3. 治疗前可先进行必要的调合，缓解急性症状；4. 牙周基础治疗，改善牙龈炎症；5. 定期复查颞下颌关节情况。",
  },
  {
    id: 5,
    title: "偏侧咀嚼综合病例",
    difficulty: "hard",
    patientInfo: {
      age: "38岁",
      gender: "女",
      occupation: "护士",
    },
    chiefComplaint: "右侧大牙疼痛三个月，吃东西只能用左边，最近感觉两边脸不一样大，关节偶尔疼。",
    intraoralDescription:
      "恒牙列，口腔卫生尚可。右侧下颌第一磨牙（46）可见大面积龋坏，已穿髓，探痛明显，叩诊（+），松动Ⅰ度。右侧后牙区多个牙齿有牙结石，牙龈红肿。右侧咬合关系不佳，左侧咬合相对稳定。面部观察右侧面部略丰满，左侧咬肌相对发达。张口度约3指，开口型偏向右侧。",
    occlusalClues: [
      "嘱患者正中咬合，右侧因疼痛无法正常咬合，左侧咬合接触良好",
      "检查发现46牙深龋穿髓，为主要疼痛来源",
      "右侧后牙区正中咬合时上颌后牙舌尖位于下颌后牙颊尖舌侧（反合）",
      "做右侧方运动时，右侧反合牙区有明显咬合干扰",
      "颞下颌关节检查：右侧关节区有压痛，开口末有弹响",
      "患者承认因右侧牙痛，近半年来一直用左侧咀嚼",
    ],
    correctSequence: ["centric", "lateral", "protrusive", "findings"],
    sequencePoints: 40,
    requiredFindings: [
      {
        id: "f5-1",
        name: "46牙急性牙髓炎",
        category: "other",
        description: "46牙深龋穿髓，探痛明显，叩痛阳性，诊断为急性牙髓炎",
        points: 10,
      },
      {
        id: "f5-2",
        name: "右侧后牙反合",
        category: "crossBite",
        description: "右侧后牙区正中咬合时反合，上颌后牙位于下颌后牙舌侧",
        points: 10,
      },
      {
        id: "f5-3",
        name: "左侧偏侧咀嚼习惯",
        category: "unilateralChewing",
        description: "因右侧牙痛，患者长期使用左侧咀嚼，为左侧偏侧咀嚼习惯",
        points: 15,
      },
      {
        id: "f5-4",
        name: "右侧方运动咬合干扰",
        category: "earlyContact",
        description: "右侧方运动时，右侧反合牙区有明显咬合干扰",
        points: 10,
      },
      {
        id: "f5-5",
        name: "颞下颌关节功能紊乱",
        category: "other",
        description: "右侧关节区压痛，开口末弹响，开口型偏右，符合颞下颌关节功能紊乱表现",
        points: 10,
      },
    ],
    decoyFindings: [
      {
        id: "d5-1",
        name: "深覆合",
        category: "deepOverbite",
        description: "上前牙覆盖下前牙超过2/3",
        points: 0,
      },
      {
        id: "d5-2",
        name: "左侧后牙反合",
        category: "crossBite",
        description: "左侧后牙区反合",
        points: 0,
      },
      {
        id: "d5-3",
        name: "前伸咬合干扰",
        category: "earlyContact",
        description: "前伸运动时后牙有早接触",
        points: 0,
      },
      {
        id: "d5-4",
        name: "46牙牙周脓肿",
        category: "other",
        description: "46牙牙周袋溢脓，牙龈肿胀",
        points: 0,
      },
    ],
    dialoguePrompts: [
      {
        trigger: "centric_done",
        text: "请问您右边牙齿疼痛有多久了？是自发性疼痛还是吃东西的时候才疼？",
      },
      {
        trigger: "unilateralChewing_found",
        text: "因为右边疼，最近是不是总用左边吃饭？这种情况有多久了？",
      },
      {
        trigger: "crossBite_found",
        text: "您有没有注意到右边上下牙咬合时，上面的牙在里面，下面的牙在外面？",
      },
      {
        trigger: "other_found",
        text: "张嘴或闭嘴的时候，耳朵前面有没有弹响、疼痛或者卡住的感觉？",
      },
    ],
    standardSummary:
      "患者38岁女性，因右侧后牙疼痛及偏侧咀嚼就诊。综合检查发现：1. 46牙急性牙髓炎（深龋穿髓，探痛明显，叩痛阳性）；2. 右侧后牙反合；3. 左侧偏侧咀嚼习惯（因右侧牙痛，近半年仅用左侧咀嚼）；4. 右侧方运动咬合干扰；5. 颞下颌关节功能紊乱（右侧关节压痛，开口末弹响，开口型偏右）。面部略有不对称，左侧咬肌相对发达。咬合检查顺序：正中咬合→侧方运动→前伸运动。建议：1. 急诊处理46牙，行根管治疗或拔除（评估保留价值），解决疼痛问题；2. 全口牙周检查及洁治，改善口腔卫生；3. 待急性炎症控制后，评估右侧后牙反合的矫正方案（正畸或修复）；4. 指导患者恢复双侧交替咀嚼，配合关节区热敷、理疗；5. 制作咬合板，保护牙齿并缓解关节症状；6. 定期复查关节及咬合情况。",
  },
];

export const getCaseById = (id: number): CaseData | undefined => {
  return CASES.find((c) => c.id === id);
};

export const getAllCases = (): CaseData[] => {
  return CASES;
};
