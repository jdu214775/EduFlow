import { Project, Task, MongoCollection, JWTStep } from '../types';

export const initialProjects: Project[] = [
  {
    id: 'p1',
    name: '応用プログラミング演習 / Advanced Web App Lab',
    description: 'React + Node.js (Express) を用いた、多言語対応・JWT認証付きのタスク管理アプリ開発',
    subject: 'システム開発実践演習 (Seminar IV)',
    progress: 75,
    members: ['R. Rakhmatov', 'Sarah Smith'],
    tasksCount: { total: 4, completed: 3 },
  },
  {
    id: 'p2',
    name: '卒業論文中間発表 / Graduation Thesis Preparation',
    description: '分散データベースのレプリケーション効率に関する研究論文の執筆とプレゼン資料の作成',
    subject: '卒業研究 (Graduation Research)',
    progress: 40,
    members: ['R. Rakhmatov'],
    tasksCount: { total: 3, completed: 1 },
  },
  {
    id: 'p3',
    name: 'データベース工学グループ課題 / DB Systems Group Project',
    description: 'MongoDBとPostgreSQLのクエリ速度比較およびドキュメント設計の正規化・非正規化モデル評価',
    subject: 'データベース工学 (Database Engineering)',
    progress: 100,
    members: ['佐藤 拓海 (Takumi)', 'R. Rakhmatov', 'Elena Rostova'],
    tasksCount: { total: 2, completed: 2 },
  },
];

export const initialTasks: Task[] = [
  {
    id: 't1',
    projectId: 'p1',
    title: '多言語言語パックの設定 (i18n core design)',
    description: '日本語、英語、ウズベク語のキーマッピング of multi-language support',
    dueDate: '2026-06-25', // Completed past task
    status: 'done',
    priority: 'high',
    assignedTo: 'R. Rakhmatov',
  },
  {
    id: 't2',
    projectId: 'p1',
    title: 'JWT認証API & ミドルウェアの開発',
    description: 'Expressでのサインイン、Token発行、リクエスト検証用の authMiddlewareの実装',
    dueDate: '2026-06-27', // Completed past task
    status: 'done',
    priority: 'high',
    assignedTo: 'R. Rakhmatov',
  },
  {
    id: 't3',
    projectId: 'p1',
    title: 'node-cronによる自動締切通知テスト',
    description: '深夜に締切2日前のタスクを抽出してアラートを出す監査スケジューラの実装',
    dueDate: '2026-06-30', // Very close! (Today is June 29, 2026)
    status: 'in_progress',
    priority: 'medium',
    assignedTo: 'Sarah Smith',
  },
  {
    id: 't4',
    projectId: 'p1',
    title: '最終報告書のまとめ・資料作成',
    description: 'テーマ④の成果物と苦労した点・学んだことをまとめたMarkdown報告書の提出',
    dueDate: '2026-07-05', // Upcoming
    status: 'todo',
    priority: 'medium',
    assignedTo: 'R. Rakhmatov',
  },
  {
    id: 't5',
    projectId: 'p2',
    title: '関連研究の文献レビュー執筆',
    description: 'NoSQLとリレーショナルDBの整合性制御に関する論文を5本精読しサマライズ',
    dueDate: '2026-06-20', // Overdue!
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'R. Rakhmatov',
  },
  {
    id: 't6',
    projectId: 'p2',
    title: 'スライド構成・アウトラインの作成',
    description: '発表時間10分に合わせた中間スライド（計12枚）の構成を指導教員に相談',
    dueDate: '2026-07-02', // Upcoming
    status: 'todo',
    priority: 'medium',
    assignedTo: 'R. Rakhmatov',
  },
  {
    id: 't7',
    projectId: 'p2',
    title: '予稿原稿（2ページ）の提出',
    description: '中間報告会用のPDF原稿の校正と提出',
    dueDate: '2026-06-24', // Done, but was overdue
    status: 'done',
    priority: 'high',
    assignedTo: 'R. Rakhmatov',
  },
  {
    id: 't8',
    projectId: 'p3',
    title: 'MongoDBスキーマの第2版(参照モデル)設計',
    description: 'タスクドキュメントをプロジェクトから参照形式として分離し、結合クエリを構築',
    dueDate: '2026-06-18', // Done
    status: 'done',
    priority: 'high',
    assignedTo: '佐藤 拓海 (Takumi)',
  },
  {
    id: 't9',
    projectId: 'p3',
    title: '計測実験と比較グラフ作成',
    description: '件数10万件におけるインデックス有無によるレスポンス速度の測定とプロット',
    dueDate: '2026-06-19', // Done
    status: 'done',
    priority: 'medium',
    assignedTo: 'Elena Rostova',
  },
];

export const mongoV1Collections: MongoCollection[] = [
  {
    name: 'Projects (Monolithic Nesting)',
    description: '開発当初の設計。すべてのタスク情報やメンバーの詳細、通知履歴を1つの巨大なプロジェクトドキュメントに配列としてネスト（埋め込み）していたため、肥大化と更新衝突が多発しました。',
    fields: [
      { name: '_id', type: 'ObjectId', description: 'ユニーク識別子', required: true },
      { name: 'name', type: 'String', description: 'プロジェクト名', required: true },
      { name: 'subject', type: 'String', description: '科目名', required: true },
      { name: 'members', type: 'Array<String>', description: '学生名の単純配列', required: true },
      { 
        name: 'tasks', 
        type: 'Array<Object>', 
        description: 'タスクオブジェクトをネスト。タスクを1件追加・削除するだけでもドキュメント全体への書き込みロックが発生し、マルチユーザ開発において深刻なコンフリクトの原因となりました。', 
        required: true 
      },
    ]
  }
];

export const mongoV2Collections: MongoCollection[] = [
  {
    name: 'Users',
    description: '学生・チームメンバーを管理する独立コレクション。JWT認証にも使用されます。',
    fields: [
      { name: '_id', type: 'ObjectId', description: 'プライマリキー', required: true },
      { name: 'username', type: 'String', description: '一意の学生ID/ユーザ名', required: true },
      { name: 'email', type: 'String', description: 'メールアドレス', required: true },
      { name: 'passwordHash', type: 'String', description: 'ハッシュ化されたパスワード', required: true },
    ]
  },
  {
    name: 'Projects',
    description: 'プロジェクトの基本メタデータのみを格納し、メンバーとタスクを「参照（ObjectId）」で紐付けるスマートモデル。',
    fields: [
      { name: '_id', type: 'ObjectId', description: 'プライマリキー', required: true },
      { name: 'name', type: 'String', description: 'プロジェクト名', required: true },
      { name: 'subject', type: 'String', description: '科目名', required: true },
      { name: 'members', type: 'Array<ObjectId>', description: 'Usersコレクションへの参照配列', required: true, isRef: true },
    ]
  },
  {
    name: 'Tasks',
    description: '個別のタスク情報を格納する、独立した正規化コレクション。プロジェクトIDや担当者IDをObjectId参照します。',
    fields: [
      { name: '_id', type: 'ObjectId', description: 'プライマリキー', required: true },
      { name: 'projectId', type: 'ObjectId', description: '所属するProjectへの参照', required: true, isRef: true },
      { name: 'title', type: 'String', description: 'タスク名', required: true },
      { name: 'description', type: 'String', description: 'タスク詳細', required: false },
      { name: 'dueDate', type: 'Date', description: '締切日（インデックス設定済み。node-cronで高速スキャン可能）', required: true },
      { name: 'status', type: 'String', description: '"todo" | "in_progress" | "done"', required: true },
      { name: 'priority', type: 'String', description: '"high" | "medium" | "low"', required: true },
      { name: 'assignedTo', type: 'ObjectId', description: 'アサインされたUserへの参照', required: false, isRef: true },
    ]
  }
];

export const jwtFlowSteps: JWTStep[] = [
  {
    title: '1. サインイン要求 (Login Request)',
    description: '学生がIDとパスワードをフロントエンドのフォームに入力し、POST /api/auth/login リクエストを送信します。',
    sender: 'client',
    status: 'idle',
  },
  {
    title: '2. 署名付きトークンの生成 (Issue JWT)',
    description: 'サーバーはデータベースでハッシュパスワードを照合し、正しい場合、秘密鍵(JWT_SECRET)で署名した有効期限(例: 24h)付きのJWTトークンを生成し返します。',
    sender: 'server',
    status: 'idle',
  },
  {
    title: '3. ローカル保管 (Store Token)',
    description: 'クライアントは受け取ったトークンを LocalStorage またはセキュアな Cookie に保存し、ログイン状態を確立します。',
    sender: 'client',
    status: 'idle',
  },
  {
    title: '4. 認証ヘッダーの付与 (Bearer Token Request)',
    description: 'プロジェクト取得やタスク更新などの保護されたAPIにリクエストする際、ヘッダーに "Authorization: Bearer <token>" を付与して送信します。',
    sender: 'client',
    status: 'idle',
  },
  {
    title: '5. トークン検証ミドルウェア (Verify & Authorize)',
    description: 'サーバー側の authMiddleware がリクエストを受け取り、トークンを取り出して秘密鍵で署名を検証します。改ざんや期限切れがなければ、リクエストを処理します。',
    sender: 'server',
    status: 'idle',
  },
];
