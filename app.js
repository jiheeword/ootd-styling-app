/**
 * 오늘의 OOTD - 나와 비슷한 사람의 실제 코디로, 실패 없는 옷 쇼핑 (MVP BETA)
 *
 * 현재 구현: 피드·커뮤니티·사진 미리보기·자가응답 기반 스타일 분석·기본 프로필 매칭(localStorage)
 * 데모/예시: 쇼룸 상품, 상품 URL 분석, 가격·품절 알림 (실제 AI 모델·쇼핑몰 API 연동 없음)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Lucide 아이콘 초기화 헬퍼
  const refreshIcons = () => {
    if (window.lucide) window.lucide.createIcons();
  };
  refreshIcons();

  // =========================================================================
  // 1. 글로벌 상태 (Global State)
  // =========================================================================
  const state = {
    currentUser: {
      isLoggedIn: true,
      nickname: '민지_스타일',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      specs: '164cm · 49kg · 여름쿨톤 웨이브'
    },
    currentNav: 'feed',
    feedFilter: 'all',
    activeDetailPost: null,
    cart: [],
    aiStep: 0,
    isRecording: false,
    recognition: null,
    // 피드 게시물은 MVP 검증용 예시 데이터입니다.
    // 착용자 키·상하의 사이즈·체형·퍼스널컬러·착용 후기를 담아 '나와 비슷한 사람' 매칭에 사용합니다.
    posts: [
      {
        id: 'post-1',
        author: '소희_데일리',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
        ageLabel: '40대',
        height: 163,
        topSize: 'S',
        bottomSize: '26',
        category: '출근룩',
        tone: '여름쿨톤',
        bodyType: '웨이브',
        image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80',
        desc: '월요일 출근할 때 가장 손이 많이 가는 쿨톤 조합이에요! 차분한 소라색 셔츠에 하이웨이스트 슬랙스로 다리가 길어 보여요 💙',
        review: '셔츠 S는 어깨가 딱 맞았고, 슬랙스 26은 허리가 살짝 남아서 벨트로 잡아줬어요.',
        items: [
          { brand: 'COS', title: '파인 팝클린 오버사이즈 셔츠', size: 'S', price: '115,000' },
          { brand: 'ZARA', title: '플루이드 와이드 하이라이즈 팬츠', size: '26', price: '59,900' }
        ],
        likes: 142,
        isLiked: false,
        scraps: 88,
        isScrapped: false,
        comments: [
          { author: '지우', text: '셔츠 핏 너무 예뻐요! 사이즈 어떻게 가셨나요?' },
          { author: '소희_데일리', text: '키 163 기준 S사이즈 했는데 딱 알맞게 예뻐요!' }
        ]
      },
      {
        id: 'post-2',
        author: '수현_모던',
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
        ageLabel: '30대',
        height: 168,
        topSize: 'M',
        bottomSize: '28',
        category: '데이트룩',
        tone: '가을웜톤',
        bodyType: '스트레이트',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
        desc: '가을 웜톤을 위한 카멜 니트 & A라인 플리츠 스커트 매칭. 허리선 똑 떨어지는 정핏 니트라 상체 부해 보이지 않아서 대만족!',
        review: '니트는 평소대로 M, 스커트는 28이 허리에 딱 맞고 길이는 무릎 아래로 떨어져요.',
        items: [
          { brand: 'MASSIMO DUTTI', title: '캐시미어 크루넥 니트', size: 'M', price: '219,000' },
          { brand: 'MANGO', title: '플리츠 미디 스커트', size: '28', price: '79,000' }
        ],
        likes: 219,
        isLiked: false,
        scraps: 135,
        isScrapped: false,
        comments: [
          { author: '민경', text: '스트레이트 체형인데 이 니트 핏 정말 날씬해 보이네요 스크랩해갑니다!' }
        ]
      },
      {
        id: 'post-3',
        author: '유진_클래식',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        ageLabel: '40대',
        height: 161,
        topSize: 'S',
        bottomSize: '25',
        category: '출근룩',
        tone: '봄웜톤',
        bodyType: '웨이브',
        image: 'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?auto=format&fit=crop&w=800&q=80',
        desc: '키작녀 웨이브 체형의 크롭 자켓 활용법! 상의를 짧게 입고 목걸이로 시선을 위로 끌어올리면 비율이 확 살아나요 ✨',
        review: '크롭 자켓 S는 팔 길이가 딱 맞았어요. 온라인에서 M 샀다가 어깨가 커서 교환했던 경험이 있어요.',
        items: [
          { brand: '스파오', title: '클래식 트위드 크롭 자켓', size: 'S', price: '69,900' },
          { brand: '골든듀', title: '옐로우골드 쁘띠 네크리스', size: '40cm', price: '380,000' }
        ],
        likes: 95,
        isLiked: false,
        scraps: 74,
        isScrapped: false,
        comments: [
          { author: '하은', text: '주얼리 골드 매칭이 너무 고급스러워요!' }
        ]
      },
      {
        id: 'post-4',
        author: '다은_미니멀',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        ageLabel: '30대',
        height: 165,
        topSize: 'M',
        bottomSize: '27',
        category: '주얼리포인트',
        tone: '여름쿨톤',
        bodyType: '웨이브',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
        desc: '단추 두 개 푼 린넨 셔츠에 실버 드롭 이어링으로 완성한 주말 브런치룩. 쇄골 드러내니까 목선이 훨씬 시원해 보여요.',
        review: '린넨 셔츠 M은 여유 있게 떨어져서 하체 쪽 라인까지 자연스럽게 덮어줘요.',
        items: [
          { brand: '아르켓', title: '릴렉스드 리넨 셔츠', size: 'M', price: '89,000' },
          { brand: '스톤헨지', title: '실버 드롭 이어링', size: '원사이즈', price: '128,000' }
        ],
        likes: 180,
        isLiked: false,
        scraps: 110,
        isScrapped: false,
        comments: [
          { author: '현주', text: '이어링 정보 여쭤봐도 될까요? 너무 청순해요!' }
        ]
      },
      {
        id: 'post-5',
        author: '정아_오피스',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        ageLabel: '40대',
        height: 164,
        topSize: 'M',
        bottomSize: '28',
        category: '출근룩',
        tone: '여름쿨톤',
        bodyType: '웨이브',
        image: 'https://images.unsplash.com/photo-1583846717393-dc2412c95ed7?auto=format&fit=crop&w=800&q=80',
        desc: '출산 후 체형이 바뀌면서 하의 고르기가 제일 어려웠는데, 허리선이 높은 버튼 스커트에 블라우스를 넣어 입는 걸로 정착했어요.',
        review: '예전엔 27이었는데 지금은 28이 편해요. 이 스커트는 정사이즈로 가도 골반이 끼지 않았어요.',
        items: [
          { brand: 'COS', title: '리본 타이 블라우스', size: 'M', price: '89,000' },
          { brand: '프론트로우', title: '하이웨이스트 버튼 스커트', size: '28', price: '148,000' }
        ],
        likes: 203,
        isLiked: false,
        scraps: 167,
        isScrapped: false,
        comments: [
          { author: '선영', text: '저도 164에 28이라 너무 참고돼요! 앉았을 때 허리 조이지 않나요?' }
        ]
      },
      {
        id: 'post-6',
        author: '미경_주말',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        ageLabel: '50대',
        height: 158,
        topSize: 'L',
        bottomSize: '30',
        category: '데이트룩',
        tone: '겨울쿨톤',
        bodyType: '내추럴',
        image: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=800&q=80',
        desc: '어깨 프레임이 있는 편이라 몸에 붙는 옷보다 여유 있는 롱 원피스가 편해요. 블랙 원피스에 챙 넓은 모자로 포인트!',
        review: '모델 사진보다 기장이 길게 나와요. 158cm면 발목까지 내려와서 굽 있는 신발을 추천해요.',
        items: [
          { brand: '르베이지', title: '릴렉스드 롱 원피스', size: 'L', price: '298,000' },
          { brand: '헬렌카민스키', title: '울 와이드 브림 햇', size: '57cm', price: '359,000' }
        ],
        likes: 88,
        isLiked: false,
        scraps: 61,
        isScrapped: false,
        comments: [
          { author: '은정', text: '기장 정보 너무 유용해요. 저도 키가 작아서 늘 고민이었어요.' }
        ]
      }
    ],
    communityPosts: [
      {
        id: 'comm-1',
        category: '골라줘',
        title: '하객룩 원피스 둘 중 어느 게 여름 쿨톤에 더 낫나요? (투표 부탁해요!)',
        body: '이번 주말 친한 친구 결혼식인데 1번 차콜 네이비 플리츠랑 2번 더스티 소라색 A라인 원피스 중에 고민입니다. 제 키는 164이고 웨이브 체형입니다!',
        author: '수민_여름쿨',
        likes: 24,
        commentsCount: 15,
        time: '12분 전'
      },
      {
        id: 'comm-2',
        category: '사이즈질문',
        title: '자라 하이라이즈 와이드 슬랙스 허리 68cm면 M 사이즈 맞을까요?',
        body: '평소 골반이 좀 있는 편이라 다른 브랜드는 66 입는데 자라는 사이즈가 좀 크게 나온다는 말이 있어서요. 실착해보신 분들 조언 부탁드립니다!',
        author: '보라보라',
        likes: 9,
        commentsCount: 8,
        time: '45분 전'
      },
      {
        id: 'comm-3',
        category: '체형고민',
        title: '상체 살이 먼저 붙는 스트레이트 체형, 자켓 고르는 필승 공식 공유해요',
        body: '어깨 패드 과하거나 오버핏 입으면 떡대 있어 보여서 몇 년간 고생하다가 정핏 싱글 자켓 + 브이넥 조합으로 정착했습니다. 비슷한 체형이신 분들 참고하세요!',
        author: '윤아_스타일리스트',
        likes: 67,
        commentsCount: 22,
        time: '3시간 전'
      },
      {
        id: 'comm-4',
        category: '세일정보',
        title: '🏷️ COS(코스) 미드 시즌 세일 시작! 쿨톤 니트 건질 거 많네요',
        body: '파인 울 보트넥 니트 30% 세일 들어갔어요! 세일 소식 보고 바로 샀습니다 ㅎㅎ 품절 빠르니 얼른 가보세요.',
        author: '쇼퍼홀릭',
        likes: 41,
        commentsCount: 13,
        time: '5시간 전'
      }
    ],
    // 내 매칭 프로필 (백엔드가 없어 localStorage에 저장)
    userProfile: {
      gender: 'female', // 'female' | 'male'
      ageGroup: '40s',  // '20s' | '30s' | '40s'
      height: 164,
      weight: null,     // 선택사항
      topSize: 'M',
      bottomSize: '28',
      bodyType: '웨이브', // '웨이브' | '스트레이트' | '내추럴'
      tone: '여름쿨톤',   // '봄웜톤' | '여름쿨톤' | '가을웜톤' | '겨울쿨톤' | ''
      styles: ['오피스', '미니멀'],
      saved: false      // 사용자가 직접 저장했는지 여부
    },
    // 자가응답 문진 답변과 그 집계 결과
    diagnosisAnswers: { metal: null, sunburn: null, contrast: null, body: null, neckline: null },
    diagnosis: {
      completed: false,
      source: 'default', // 'default' | 'answers' | 'manual'
      body: '웨이브',
      tally: { cool: 0, warm: 0, tie: false }
    },
    photoInputs: { face: null, body: null },
    currentPersona: 'summer_cool_wave',
    femalePersonas: {
      summer_cool_wave: {
        key: 'summer_cool_wave',
        toneName: '여름 쿨 뮤트',
        bodyName: '웨이브 골격',
        title: '여성 고객님을 위한 여름 쿨 뮤트 & 웨이브 체형 솔루션',
        desc: '노란기를 뺀 부드러운 라벤더·스카이블루와 하이웨이스트 A라인 실루엣이 결점을 가리고 장점을 극대화합니다.',
        paletteDots: [
          { color: '#8b9dc3', name: '더스티 스카이' },
          { color: '#b39eb5', name: '라벤더 포그' },
          { color: '#d4c4c8', name: '뮤트 로즈' },
          { color: '#f8fafc', name: '클라우드 화이트' }
        ],
        bodyDesc: '가늘고 우아한 상체선과 부드러운 골반 라인. 허리선을 올려 잡는 크롭 상의 + 와이드 슬랙스가 필승 조합입니다.',
        bodyTags: ['#하이웨이스트', '#숏자켓', '#허리선강조'],
        jewelDesc: '목선을 길어 보이게 하는 U넥/보트넥 상의에, 투명감을 극대화하는 실버925 드롭 이어링을 매칭하세요.',
        jewelTags: ['#보트넥/스퀘어넥', '#실버925', '#드롭이어링'],
        items: [
          {
            id: 'cur-1',
            mall: '29CM / 마시모두띠',
            brand: 'MASSIMO DUTTI',
            title: '벨티드 더블 울 하프 코트 (스카이블루)',
            fit: '웨이브 체형 보완: <strong>허리 스트랩으로 황금비율 연출</strong>',
            size: '추천: S (체형 맞춤)',
            price: 399000,
            stock: 3,
            image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-2',
            mall: 'COS 공식몰',
            brand: 'COS (코스)',
            title: '파인 게이지 울 보트넥 니트 (라이트라벤더)',
            fit: '네크라인 최적화: <strong>쇄골을 드러내어 목선을 길게 연장</strong>',
            size: '추천: M (정핏)',
            price: 135000,
            stock: 2,
            image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-3',
            mall: 'ZARA 온라인스토어',
            brand: 'ZARA',
            title: '플루이드 플리츠 와이드 슬랙스 (페일그레이)',
            fit: '하체 커버: <strong>골반 곡선을 부드럽게 감싸는 실루엣</strong>',
            size: '추천: M (실측 허리 68cm)',
            price: 59900,
            stock: 1,
            image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-4',
            mall: 'W컨셉 (W Concept)',
            brand: 'CUEREN (쿠에른)',
            title: '발렌시아 레더 드라이빙 로퍼 (클라우드화이트)',
            fit: '발목 라인: <strong>슬림한 쉐입으로 다리를 곧고 길게</strong>',
            size: '추천: 240mm (발볼 보통)',
            price: 198000,
            stock: 2,
            image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-5',
            mall: '골든듀 공식몰',
            brand: 'GOLDENDEW (골든듀)',
            title: '플래티넘950 페어컷 다이아 드롭 이어링',
            fit: '주얼리 톤 매칭: <strong>쿨톤 피부를 투명하게 밝히는 실버</strong>',
            size: '원사이즈',
            price: 490000,
            stock: 4,
            image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=500&q=80'
          }
        ]
      },
      spring_warm_straight: {
        key: 'spring_warm_straight',
        toneName: '봄 웜 브라이트',
        bodyName: '스트레이트 골격',
        title: '여성 고객님을 위한 봄 웜 브라이트 & 스트레이트 체형 솔루션',
        desc: '생기 넘치는 코랄 핑크와 피치, 군더더기 없는 정핏 브이넥과 싱글 자켓이 볼륨감 있는 상체를 날씬하게 정돈합니다.',
        paletteDots: [
          { color: '#ff8a7a', name: '생기 코랄' },
          { color: '#ffb997', name: '피치 블러셔' },
          { color: '#fef3c7', name: '라이트 버터' },
          { color: '#6ee7b7', name: '스프링 민트' }
        ],
        bodyDesc: '상체 볼륨감과 곧게 뻗은 다리 라인이 특징입니다. 두꺼운 오버핏보다는 깔끔하게 떨어지는 테일러드 싱글 자켓과 일자 슬랙스가 필승 핏입니다.',
        bodyTags: ['#정핏싱글자켓', '#스트레이트슬랙스', '#V넥라인'],
        jewelDesc: '따뜻한 피부톤에 자연스럽게 감기는 14K/18K 옐로우 골드와 쇄골 라인을 트는 심플 체인 네크리스를 추천합니다.',
        jewelTags: ['#14K골드', '#브이넥니트', '#심플펜던트'],
        items: [
          {
            id: 'cur-sp-1',
            mall: '29CM 셀렉트숍',
            brand: 'DUNST (던스트)',
            title: '클래식 2버튼 테일러드 싱글 울 자켓 (오트밀 카멜)',
            fit: '스트레이트 체형 보완: <strong>어깨선 정핏 & 싱글 버튼 슬림핏</strong>',
            size: '추천: M (정핏 최적화)',
            price: 248000,
            stock: 3,
            image: 'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-sp-2',
            mall: '무신사 스토어 (MUSINSA)',
            brand: '무신사 스탠다드',
            title: '퓨어 캐시미어 100% 브이넥 니트 (피치코랄)',
            fit: '네크라인 최적화: <strong>깊지 않은 V넥으로 목선 슬림화</strong>',
            size: '추천: M (상체 볼륨 축소)',
            price: 89900,
            stock: 5,
            image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-sp-3',
            mall: 'W컨셉 (W Concept)',
            brand: 'FRONTROW (프론트로우)',
            title: '드라마 컬렉션 스트레이트 트라우저 (크림아이보리)',
            fit: '다리 라인: <strong>군더더기 없이 일자로 곧게 떨어지는 실루엣</strong>',
            size: '추천: S (허리 26~27인치)',
            price: 148000,
            stock: 2,
            image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-sp-4',
            mall: '29CM / 슈콤마보니',
            brand: 'SUECOMMA BONNIE',
            title: '소프트 카프스킨 스퀘어토 슬링백 로퍼 (카멜탄)',
            fit: '발목 라인: <strong>모던한 쉐입으로 클래식한 발끝 완성</strong>',
            size: '추천: 240mm (발볼 정사이즈)',
            price: 218000,
            stock: 1,
            image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-sp-5',
            mall: '디디에두보 공식몰',
            brand: 'DIDIER DUBOT',
            title: '14K 옐로우골드 드봉 D 코인 펜던트 목걸이',
            fit: '주얼리 매칭: <strong>봄 웜톤 피부에 온기를 더하는 골드</strong>',
            size: '원사이즈 (체인 42cm)',
            price: 358000,
            stock: 4,
            image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80'
          }
        ]
      },
      autumn_warm_natural: {
        key: 'autumn_warm_natural',
        toneName: '가을 웜 딥 & 뮤트',
        bodyName: '내추럴 골격',
        title: '여성 고객님을 위한 가을 웜 딥 & 내추럴 체형 솔루션',
        desc: '깊이감 있는 카멜 베이지와 올리브 카키, 골격미를 시크하게 살려주는 오버사이즈 롱코트와 와이드 치노 팬츠의 조합입니다.',
        paletteDots: [
          { color: '#b47b48', name: '카멜 골드' },
          { color: '#556b2f', name: '올리브 카키' },
          { color: '#9e472a', name: '테라코타' },
          { color: '#f3e8dc', name: '오트밀 베이지' }
        ],
        bodyDesc: '어깨와 쇄골의 자연스러운 프레임감과 긴 다리가 장점입니다. 몸에 달라붙는 옷보다 자연스러운 구김이 멋스러운 린넨, 울, 와이드 실루엣이 탁월합니다.',
        bodyTags: ['#오버사이즈롱코트', '#와이드치노', '#내추럴텍스처'],
        jewelDesc: '와이드한 숄카라/오픈 카라 셔츠에 매칭하는 엔틱 골드와 볼드한 텍스처의 브라스 뱅글이 그윽한 무드를 극대화합니다.',
        jewelTags: ['#엔틱골드', '#오픈카라셔츠', '#볼드뱅글'],
        items: [
          {
            id: 'cur-at-1',
            mall: '29CM / 노앙',
            brand: 'NOHANT (노앙)',
            title: '오버사이즈드 더블 롱 울 트렌치 코트 (카멜 브라운)',
            fit: '내추럴 체형 보완: <strong>자연스러운 어깨 드롭 & 맥시 롱 기장</strong>',
            size: '추천: FREE (루즈핏 최적)',
            price: 458000,
            stock: 2,
            image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-at-2',
            mall: 'COS 공식몰',
            brand: 'COS (코스)',
            title: '릴렉스드 핏 메리노 울 롤넥 니트 (올리브 카키)',
            fit: '네크라인 최적화: <strong>목을 조이지 않는 여유로운 롤넥</strong>',
            size: '추천: L (내추럴 실루엣)',
            price: 150000,
            stock: 3,
            image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-at-3',
            mall: '무신사 스토어 (MUSINSA)',
            brand: 'MODIFIED (모디파이드)',
            title: '투턱 와이드 헤비 치노 트라우저 (카키베이지)',
            fit: '하체 실루엣: <strong>풍성한 턱 주름으로 완성하는 트렌디 핏</strong>',
            size: '추천: M (총장 105cm)',
            price: 69000,
            stock: 4,
            image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-at-4',
            mall: '무신사 / 닥터마틴',
            brand: 'DR.MARTENS (닥터마틴)',
            title: '1461 3홀 스무스 레더 옥스포드 더비 (에스프레소)',
            fit: '슈즈 라인: <strong>볼드한 아웃솔로 내추럴 체형 밸런스 유지</strong>',
            size: '추천: UK5 (240mm)',
            price: 190000,
            stock: 2,
            image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-at-5',
            mall: 'W컨셉 / 빈티지헐리우드',
            brand: 'VINTAGE HOLLYWOOD',
            title: '빈티지 엔틱 브라스 볼드 체인 브레이슬릿',
            fit: '주얼리 매칭: <strong>가을 웜톤의 그윽함을 살리는 엔틱 골드</strong>',
            size: '원사이즈',
            price: 89000,
            stock: 5,
            image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=80'
          }
        ]
      },
      winter_cool_straight: {
        key: 'winter_cool_straight',
        toneName: '겨울 쿨 딥 & 비비드',
        bodyName: '스트레이트 골격',
        title: '여성 고객님을 위한 겨울 쿨 딥 & 스트레이트 체형 솔루션',
        desc: '강렬한 젯 블랙과 퓨어 화이트의 선명한 대비감, 칼각으로 떨어지는 테일러드 핏이 도회적인 분위기를 극대화합니다.',
        paletteDots: [
          { color: '#090a0f', name: '젯 블랙' },
          { color: '#ffffff', name: '퓨어 스노우' },
          { color: '#1d4ed8', name: '로열 코발트' },
          { color: '#881337', name: '버건디 와인' }
        ],
        bodyDesc: '탄탄하고 곧은 골격선에 가장 잘 어울리는 칼각 테일러드 블레이저와 스트레이트 핀턱 팬츠로 드라마틱한 슬림핏을 완성합니다.',
        bodyTags: ['#모노톤대비', '#칼각블레이저', '#핀턱슬랙스'],
        jewelDesc: '각진 스퀘어 넥라인에 매칭하는 차가운 화이트 골드와 플래티넘 다이아몬드 포인트 주얼리를 추천합니다.',
        jewelTags: ['#화이트골드', '#스퀘어넥', '#다이아몬드'],
        items: [
          {
            id: 'cur-wt-1',
            mall: 'ZARA 온라인스토어',
            brand: 'ZARA',
            title: '테일러드 싱글 버튼 블레이저 (미드나잇 블랙)',
            fit: '스트레이트 체형: <strong>흐트러짐 없는 어깨 각과 슬림한 허리 라인</strong>',
            size: '추천: S (슬림 테일러드)',
            price: 149900,
            stock: 2,
            image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-wt-2',
            mall: 'COS 공식몰',
            brand: 'COS (코스)',
            title: '모던 클래식 퓨어 울 하이넥 스웨터 (스노우화이트)',
            fit: '컬러 대비: <strong>블랙 자켓 안에 받쳐 입는 눈부신 퓨어 화이트</strong>',
            size: '추천: M (정핏)',
            price: 135000,
            stock: 3,
            image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-wt-3',
            mall: '29CM / 렉토',
            brand: 'RECTO (렉토)',
            title: '시그니처 투턱 테일러드 와이드 트라우저 (차콜)',
            fit: '실루엣 완성: <strong>샤프한 핀턱 주름으로 곧고 긴 다리 연출</strong>',
            size: '추천: S (허리 26~27)',
            price: 268000,
            stock: 1,
            image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-wt-4',
            mall: 'W컨셉 / 쿠에른',
            brand: 'CUEREN (쿠에른)',
            title: '런던 레더 첼시 부츠 08 (젯블랙)',
            fit: '발목 핏: <strong>발목을 매끈하게 감싸는 슬림 라인</strong>',
            size: '추천: 240mm',
            price: 238000,
            stock: 2,
            image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-wt-5',
            mall: '스톤헨지 공식몰',
            brand: 'STONEHENgE',
            title: '14K 화이트골드 엣지 바 드롭 이어링',
            fit: '주얼리 매칭: <strong>겨울 쿨톤의 시크함을 극대화하는 플래티넘</strong>',
            size: '원사이즈',
            price: 380000,
            stock: 3,
            image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=500&q=80'
          }
        ]
      }
    },
    malePersonas: {
      summer_cool_wave: {
        key: 'summer_cool_wave',
        toneName: '여름 쿨 뮤트 (남성)',
        bodyName: '슬림·웨이브 골격',
        title: '남성 고객님을 위한 여름 쿨 뮤트 & 슬림 테이퍼드 솔루션',
        desc: '도시적인 차콜과 쿨네이비, 쇄골을 단정하게 감싸는 크루넥과 슬림 테이퍼드 슬랙스가 깔끔하고 지적인 무드를 연출합니다.',
        paletteDots: [
          { color: '#1e293b', name: '다크 네이비' },
          { color: '#64748b', name: '슬레이트 그레이' },
          { color: '#94a3b8', name: '더스티 스카이' },
          { color: '#f8fafc', name: '클린 화이트' }
        ],
        bodyDesc: '슬림하고 유연한 상체 라인에는 너무 펑퍼짐한 오버핏보다 어깨선이 정확한 세미루즈 블레이저와 테이퍼드 슬랙스가 신체 비율을 완벽하게 살립니다.',
        bodyTags: ['#세미루즈블레이저', '#테이퍼드슬랙스', '#모노톤쿨'],
        jewelDesc: '실버 메탈 스트랩의 미니멀 바우하우스 워치와 플랫 가죽 스니커즈로 군더더기 없는 도회적 매력을 완성합니다.',
        jewelTags: ['#실버메탈워치', '#미니멀스니커즈', '#크루넥니트'],
        items: [
          {
            id: 'cur-m-sm-1',
            mall: '29CM / 포터리',
            brand: 'POTTERY (포터리)',
            title: '울 컴포트 2버튼 싱글 자켓 (스카이 그레이)',
            fit: '남성 체형 보완: <strong>자연스러운 어깨 패드와 편안한 암홀</strong>',
            size: '추천: 3사이즈 (100~105호)',
            price: 389000,
            stock: 2,
            image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-m-sm-2',
            mall: 'COS 공식몰 (MEN)',
            brand: 'COS MEN (코스)',
            title: '릴렉스드 핏 메리노 울 스웨터 (라이트더스티블루)',
            fit: '네크라인 최적화: <strong>목선을 단정하게 정리하는 립 크루넥</strong>',
            size: '추천: L (레귤러핏)',
            price: 135000,
            stock: 3,
            image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-m-sm-3',
            mall: '무신사 스토어 (MUSINSA)',
            brand: '무신사 스탠다드',
            title: '테이퍼드 핏 쿨맥스 울 트라우저 (차콜)',
            fit: '하체 실루엣: <strong>허벅지는 여유롭고 밑단으로 슬림하게</strong>',
            size: '추천: 31인치 (총장 102cm)',
            price: 49900,
            stock: 5,
            image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-m-sm-4',
            mall: '29CM 셀렉트',
            brand: 'COMMON PROJECTS',
            title: '오리지널 아킬레스 로우 레더 스니커즈 (화이트)',
            fit: '슈즈 라인: <strong>이탈리아 수제 가죽으로 완성하는 미니멀 정점</strong>',
            size: '추천: EU42 (270mm)',
            price: 380000,
            stock: 1,
            image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-m-sm-5',
            mall: '무신사 / 바우하우스',
            brand: 'DUFA (듀파)',
            title: '발터 그로피우스 클래식 메탈 메쉬 워치 (실버)',
            fit: '남성 액세서리: <strong>쿨톤 남성의 손목을 빛내는 심플 실버</strong>',
            size: '케이스 38mm',
            price: 280000,
            stock: 4,
            image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=500&q=80'
          }
        ]
      },
      spring_warm_straight: {
        key: 'spring_warm_straight',
        toneName: '봄 웜 브라이트 (남성)',
        bodyName: '스트레이트 골격 (탄탄 체형)',
        title: '남성 고객님을 위한 봄 웜 브라이트 & 테일러드 치노 솔루션',
        desc: '생동감 있는 오트밀과 피치 베이지, 어깨 각을 샤프하게 살려주는 테일러드 자켓과 크림 치노 팬츠가 활력과 호감을 줍니다.',
        paletteDots: [
          { color: '#ea580c', name: '브릭 오렌지' },
          { color: '#fb923c', name: '웜 애프리콧' },
          { color: '#fef08a', name: '크림 버터' },
          { color: '#15803d', name: '보태니컬 그린' }
        ],
        bodyDesc: '가슴과 어깨의 두께감이 있는 탄탄한 체형으로, 지나치게 헐렁한 오버핏은 몸이 커 보일 수 있습니다. 정핏 2버튼 자켓과 일자 치노가 베스트입니다.',
        bodyTags: ['#정핏2버튼', '#스트레이트치노', '#산뜻한웜톤'],
        jewelDesc: '따뜻한 브라운 가죽 스트랩 워치와 클래식 페니 로퍼가 봄 웜톤 남성의 훈훈한 인상을 완성합니다.',
        jewelTags: ['#브라운레더워치', '#페니로퍼', '#V넥캐시미어'],
        items: [
          {
            id: 'cur-m-sp-1',
            mall: '무신사 / 쿠어',
            brand: 'COOR (쿠어)',
            title: '클래식 2버튼 울 싱글 자켓 (오트밀 카멜)',
            fit: '스트레이트 골격 최적: <strong>탄탄한 어깨 패드와 슬림 라펠</strong>',
            size: '추천: L (100호)',
            price: 238000,
            stock: 3,
            image: 'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-m-sp-2',
            mall: '무신사 스탠다드',
            brand: '무신사 스탠다드',
            title: '퓨어 캐시미어 100% 브이넥 니트 (웜아이보리)',
            fit: '목선 보완: <strong>과하지 않은 V넥으로 목이 굵어 보이지 않음</strong>',
            size: '추천: L (여유핏)',
            price: 89900,
            stock: 4,
            image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-m-sp-3',
            mall: '29CM / 드로우핏',
            brand: 'DRAW FIT (드로우핏)',
            title: '스트레이트 핏 원턱 치노 트라우저 (크림베이지)',
            fit: '다리 라인: <strong>일자로 곧게 뻗어 하체 비율을 길게 정돈</strong>',
            size: '추천: M (허리 30~31인치)',
            price: 68000,
            stock: 2,
            image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-m-sp-4',
            mall: 'W컨셉 / 바스',
            brand: 'G.H. BASS (바스)',
            title: '라르손 클래식 레더 페니 로퍼 (버건디 탄)',
            fit: '클래식 발끝: <strong>천연 소가죽의 광택과 편안한 쿠셔닝</strong>',
            size: '추천: US9 (270mm)',
            price: 189000,
            stock: 2,
            image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-m-sp-5',
            mall: '29CM / 해밀턴',
            brand: 'HAMILTON (해밀턴)',
            title: '재즈마스터 오픈하트 오토매틱 (브라운 골드)',
            fit: '워치 매칭: <strong>웜톤 남성 피부에 자연스러운 브라운 가죽</strong>',
            size: '케이스 42mm',
            price: 450000,
            stock: 1,
            image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=80'
          }
        ]
      },
      autumn_warm_natural: {
        key: 'autumn_warm_natural',
        toneName: '가을 웜 딥 & 뮤트 (남성)',
        bodyName: '내추럴 골격 (프레임 체형)',
        title: '남성 고객님을 위한 가을 웜 딥 & 오버 발마칸 코트 솔루션',
        desc: '깊이감 넘치는 카멜과 올리브 카키, 넓은 어깨 프레임을 남성답게 살려주는 롱 발마칸 코트와 와이드 치노의 멋스러운 앙상블입니다.',
        paletteDots: [
          { color: '#78350f', name: '딥 카멜' },
          { color: '#3f6212', name: '올리브 포레스트' },
          { color: '#854d0e', name: '골든 브라운' },
          { color: '#fef3c7', name: '오트밀 베이지' }
        ],
        bodyDesc: '어깨와 쇄골 프레임이 발달하고 팔다리가 긴 체형입니다. 몸에 딱 붙는 슬림핏보다 텍스처가 살아있는 헤비 치노와 여유로운 롱코트가 압도적인 분위기를 만듭니다.',
        bodyTags: ['#롱발마칸코트', '#와이드치노', '#올리브카키'],
        jewelDesc: '묵직한 엔틱 브라스 버클의 가죽 벨트와 프랑스 전통 더비 슈즈로 남성미 넘치는 가을 룩을 완성합니다.',
        jewelTags: ['#레더더비슈즈', '#브라스벨트', '#롤넥니트'],
        items: [
          {
            id: 'cur-m-at-1',
            mall: '29CM / 노앙',
            brand: 'NOHANT (노앙)',
            title: '오버사이즈드 래글런 롱 발마칸 울 코트 (카멜 브라운)',
            fit: '남성 내추럴 보완: <strong>맥시 기장과 자연스러운 어깨 래글런 드롭</strong>',
            size: '추천: L (루즈핏 최적)',
            price: 485000,
            stock: 2,
            image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-m-at-2',
            mall: '신세계몰 / 타임옴므',
            brand: 'TIME HOMME (타임옴므)',
            title: '파인 메리노 울 롤넥 니트 (올리브 카키)',
            fit: '네크라인 최적화: <strong>목을 여유롭게 감싸는 클래식 터틀넥</strong>',
            size: '추천: 105호 (여유 실루엣)',
            price: 265000,
            stock: 3,
            image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-m-at-3',
            mall: '무신사 스토어 (MUSINSA)',
            brand: 'MODIFIED (모디파이드)',
            title: '투턱 와이드 헤비 치노 트라우저 (올리브베이지)',
            fit: '하체 실루엣: <strong>풍성한 턱 주름으로 완성하는 트렌디 남성 핏</strong>',
            size: '추천: L (총장 106cm)',
            price: 69000,
            stock: 4,
            image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-m-at-4',
            mall: '29CM / 클레망',
            brand: 'KLEMAN (클레망)',
            title: '파드레 오리지널 레더 더비 슈즈 (에스프레소 브라운)',
            fit: '슈즈 라인: <strong>프랑스 경찰화 베이스의 탄탄한 러버 아웃솔</strong>',
            size: '추천: 42 (270mm)',
            price: 218000,
            stock: 2,
            image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-m-at-5',
            mall: '신세계몰 / 몽블랑',
            brand: 'MONTBLANC (몽블랑)',
            title: '클래식 레더 리버서블 벨트 (브라운/골드)',
            fit: '남성 액세서리: <strong>가을 웜톤 남성의 품격을 높이는 천연 레더</strong>',
            size: '프리사이즈 (길이 조절 가능)',
            price: 390000,
            stock: 3,
            image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=80'
          }
        ]
      },
      winter_cool_straight: {
        key: 'winter_cool_straight',
        toneName: '겨울 쿨 딥 & 비비드 (남성)',
        bodyName: '스트레이트 골격 (포멀 체형)',
        title: '남성 고객님을 위한 겨울 쿨 딥 & 솔리드 옴므 블랙 수트 솔루션',
        desc: '차갑고 선명한 젯 블랙과 스노우 화이트의 하이 콘트라스트, 칼각 테일러드 핏이 도시적인 럭셔리 무드를 완성합니다.',
        paletteDots: [
          { color: '#000000', name: '젯 블랙' },
          { color: '#ffffff', name: '퓨어 스노우' },
          { color: '#1e3a8a', name: '로열 딥블루' },
          { color: '#4c0519', name: '다크 체리' }
        ],
        bodyDesc: '곧은 척추와 넓은 흉곽을 가진 남성으로, 흐물거리는 옷보다는 각이 명확하게 잡힌 울 블레이저와 스트레이트 핀턱 팬츠가 최적의 수트 핏을 냅니다.',
        bodyTags: ['#칼각수트', '#샤프핀턱', '#블랙앤화이트'],
        jewelDesc: '닥터마틴 유광 더비 슈즈와 스틸 브레이슬릿 크로노 워치로 시크하고 남성다운 카리스마를 강조합니다.',
        jewelTags: ['#유광더비슈즈', '#스틸워치', '#화이트터틀넥'],
        items: [
          {
            id: 'cur-m-wt-1',
            mall: '현대H몰 / 솔리드옴므',
            brand: 'SOLID HOMME (솔리드옴므)',
            title: '테일러드 2버튼 울 싱글 자켓 (미드나잇 젯블랙)',
            fit: '남성 스트레이트: <strong>흐트러짐 없는 어깨 각과 슬림한 허리 테이퍼링</strong>',
            size: '추천: 50호 (105호 최적)',
            price: 680000,
            stock: 2,
            image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-m-wt-2',
            mall: 'COS 공식몰 (MEN)',
            brand: 'COS MEN (코스)',
            title: '모던 클래식 퓨어 울 크루넥 니트 (스노우화이트)',
            fit: '컬러 대비: <strong>블랙 자켓 안에 받쳐 입는 눈부신 퓨어 화이트</strong>',
            size: '추천: L (정핏)',
            price: 150000,
            stock: 3,
            image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-m-wt-3',
            mall: '29CM / 렉토 옴므',
            brand: 'RECTO (렉토)',
            title: '시그니처 샤프 핀턱 와이드 울 트라우저 (딥차콜)',
            fit: '실루엣 완성: <strong>샤프한 칼주름으로 곧고 긴 다리 연출</strong>',
            size: '추천: L (허리 32인치)',
            price: 288000,
            stock: 1,
            image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-m-wt-4',
            mall: '무신사 / 닥터마틴',
            brand: 'DR.MARTENS (닥터마틴)',
            title: '1461 3홀 스무스 레더 더비 슈즈 (블랙)',
            fit: '슈즈 라인: <strong>겨울 쿨톤의 칼각 룩을 받쳐주는 블랙 더비</strong>',
            size: '추천: UK8 (270mm)',
            price: 190000,
            stock: 3,
            image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 'cur-m-wt-5',
            mall: '신세계몰 / 튜더',
            brand: 'TUDOR (튜더)',
            title: '블랙베이 스틸 브레이슬릿 크로노그래프 (실버)',
            fit: '남성 액세서리: <strong>쿨톤 남성의 손목을 묵직하게 완성하는 스틸</strong>',
            size: '케이스 41mm',
            price: 580000,
            stock: 1,
            image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=500&q=80'
          }
        ]
      }
    },
    get personas() {
      return this.userProfile.gender === 'male' ? this.malePersonas : this.femalePersonas;
    },
    get curatedItems() {
      return this.personas[this.currentPersona]?.items || this.personas.summer_cool_wave.items;
    }
  };

  // =========================================================================
  // 1-1. 공통 헬퍼: 저장소, 표시 라벨, 기본 프로필 매칭 점수
  // =========================================================================
  const PROFILE_KEY = 'ootd_my_profile_v1';
  const DIAGNOSIS_KEY = 'ootd_style_diagnosis_v1';

  const readStore = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key) || 'null');
    } catch (e) {
      return null;
    }
  };
  const writeStore = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('localStorage 저장 실패:', e);
    }
  };

  const escapeHtml = (text) => String(text ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));

  const TOP_SIZES = [['XS', 'XS (44)'], ['S', 'S (55)'], ['M', 'M (66)'], ['L', 'L (77)'], ['XL', 'XL (88)']];
  const BOTTOM_SIZES = ['24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34'];

  // 퍼스널컬러 ↔ 결과 페르소나(상품·팔레트 묶음) 매핑
  const PERSONA_TONE = {
    spring_warm_straight: '봄웜톤',
    summer_cool_wave: '여름쿨톤',
    autumn_warm_natural: '가을웜톤',
    winter_cool_straight: '겨울쿨톤'
  };
  const TONE_PERSONA = Object.fromEntries(Object.entries(PERSONA_TONE).map(([k, v]) => [v, k]));

  // 체형별 설명은 해당 체형을 대표하는 페르소나 데이터에서 가져온다
  const BODY_PERSONA = {
    '웨이브': 'summer_cool_wave',
    '스트레이트': 'spring_warm_straight',
    '내추럴': 'autumn_warm_natural'
  };

  const TONE_SUMMARY = {
    summer_cool_wave: '노란기를 뺀 라벤더·스카이블루·뮤트 로즈처럼 부드럽고 맑은 쿨 컬러가 얼굴을 환하게 해줘요.',
    spring_warm_straight: '코랄 핑크·피치·라이트 버터처럼 밝고 따뜻한 컬러가 생기를 더해줘요.',
    autumn_warm_natural: '카멜·올리브 카키·테라코타처럼 깊이감 있는 웜 컬러가 차분하고 고급스러운 인상을 만들어줘요.',
    winter_cool_straight: '블랙·퓨어 화이트·코발트처럼 선명하고 대비가 강한 쿨 컬러가 또렷한 인상을 살려줘요.'
  };

  const toneLabel = (tone) => (tone || '').replace(/(봄|여름|가을|겨울)(웜톤|쿨톤)/, '$1 $2');
  const ageLabelOf = (ageGroup) => ({ '20s': '20대', '30s': '30대', '40s': '40대+' }[ageGroup] || '');

  const loadProfile = () => {
    const saved = readStore(PROFILE_KEY);
    if (saved && typeof saved === 'object') {
      Object.assign(state.userProfile, saved);
    }
  };

  const saveProfile = (markSaved = false) => {
    if (markSaved) state.userProfile.saved = true;
    writeStore(PROFILE_KEY, state.userProfile);
  };

  // 기본 프로필 매칭 점수 (AI 정확도가 아닌 규칙 기반 점수, 100점 만점)
  const scoreSimilarity = (profile, post) => {
    let score = 0;
    const reasons = [];
    const bodyMatch = !!profile.bodyType && profile.bodyType === post.bodyType;
    const toneMatch = !!profile.tone && profile.tone === post.tone;
    if (bodyMatch) { score += 35; reasons.push('체형'); }
    if (toneMatch) { score += 25; reasons.push('퍼스널컬러'); }
    if (profile.height && post.height) {
      const diff = Math.abs(profile.height - post.height);
      if (diff <= 3) { score += 20; reasons.push('키 ±3cm'); }
      else if (diff <= 7) { score += 10; reasons.push('키 ±7cm'); }
    }
    if (profile.topSize && profile.topSize === post.topSize) { score += 10; reasons.push('상의 사이즈'); }
    if (profile.bottomSize && profile.bottomSize === post.bottomSize) { score += 10; reasons.push('하의 사이즈'); }

    let label = '';
    if (bodyMatch && toneMatch) label = '나와 체형·톤 유사';
    else if (bodyMatch) label = '나와 체형 유사';
    else if (toneMatch) label = '나와 톤 유사';

    return { score, reasons, label };
  };

  const profileChipsHtml = (p) => `
    <span class="fit-chip strong">${escapeHtml(p.height)}cm</span>
    <span class="fit-chip">상의 ${escapeHtml(p.topSize || '-')} / 하의 ${escapeHtml(p.bottomSize || '-')}</span>
    <span class="fit-chip">${escapeHtml(p.bodyType)} 체형</span>
    ${p.tone ? `<span class="fit-chip tone">${escapeHtml(toneLabel(p.tone))}</span>` : ''}
  `;

  // =========================================================================
  // 2. 뷰 전환 및 네비게이션 (Feed / AI / Community)
  // =========================================================================
  window.switchNav = (targetId) => {
    state.currentNav = targetId;

    // 모든 뷰 숨김
    document.querySelectorAll('.content-view').forEach(view => {
      view.style.display = 'none';
      view.classList.remove('active');
    });

    // 타겟 뷰 표시
    const activeView = document.getElementById(`view-${targetId}`);
    if (activeView) {
      activeView.style.display = 'block';
      activeView.classList.add('active');
    }

    // 헤더 및 모바일 네비 탭 활성화 상태 업데이트
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.target === targetId);
    });
    document.querySelectorAll('.m-nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.target === targetId);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    refreshIcons();
  };

  // =========================================================================
  // 2-1. 화면 뷰 모드 전환 (PC 전체화면 뷰 vs 모바일 스마트폰 뷰)
  // =========================================================================
  window.setViewMode = (mode) => {
    const pcBtn = document.getElementById('btn-view-pc');
    const mBtn = document.getElementById('btn-view-mobile');

    if (mode === 'pc') {
      document.body.classList.add('force-pc-mode');
      document.body.classList.remove('force-mobile-mode');
      pcBtn?.classList.add('active');
      mBtn?.classList.remove('active');
      showToast('info', '🖥️ PC 화면 모드', '넓고 시원한 4열 데스크톱 전체화면으로 표시됩니다.');
    } else {
      document.body.classList.add('force-mobile-mode');
      document.body.classList.remove('force-pc-mode');
      mBtn?.classList.add('active');
      pcBtn?.classList.remove('active');
      showToast('info', '📱 스마트폰 모드', '모바일 앱 화면으로 전환되었습니다.');
    }
    refreshIcons();
  };

  // =========================================================================
  // 3. OOTD 패션 피드 렌더링 (나와 비슷한 사람의 실제 착장)
  // =========================================================================
  const itemName = (item) => [item.brand, item.title].filter(Boolean).join(' ');

  const pinHtml = (item, pinClass) => item ? `
    <div class="item-tag-pin ${pinClass}" onclick="event.stopPropagation();">
      <span class="pin-dot"></span>
      <div class="pin-popover">
        <span class="pin-brand">${escapeHtml(item.brand || '착용 제품')}</span>
        <strong class="pin-title">${escapeHtml(item.title)}</strong>
        <span class="pin-price">${item.size ? `사이즈 ${escapeHtml(item.size)}` : ''}${item.price ? ` · ₩ ${escapeHtml(item.price)}` : ''}</span>
      </div>
    </div>
  ` : '';

  const postMatchesFilter = (post, filter) => {
    if (filter === 'all' || filter === 'similar') return true;
    return post.category === filter ||
           post.tone.includes(filter) ||
           filter.includes(post.bodyType);
  };

  const renderSimilarInfoBar = () => {
    const bar = document.getElementById('similar-info-bar');
    if (!bar) return;
    const isSimilar = state.feedFilter === 'similar';
    bar.style.display = isSimilar ? 'flex' : 'none';
    if (!isSimilar) return;
    bar.innerHTML = `
      <div class="similar-info-main">
        <strong>👯 기본 프로필 매칭 점수가 높은 순으로 정렬했어요</strong>
        <span>체형 일치 35 · 퍼스널컬러 일치 25 · 키 ±3cm 20 (±7cm 10) · 상의 사이즈 10 · 하의 사이즈 10 — AI 정확도가 아닌 규칙 기반 점수입니다.</span>
        <div class="fit-spec-chips">내 프로필: ${profileChipsHtml(state.userProfile)}</div>
      </div>
      <button type="button" class="result-edit-btn" onclick="openProfileModal()"><i data-lucide="user-cog"></i> 프로필 수정</button>
    `;
  };

  const renderFeed = () => {
    const feedGrid = document.getElementById('feed-grid');
    if (!feedGrid) return;
    feedGrid.innerHTML = '';

    const profile = state.userProfile;
    let entries = state.posts
      .filter(post => postMatchesFilter(post, state.feedFilter))
      .map(post => ({ post, match: profile.saved ? scoreSimilarity(profile, post) : null }));

    if (state.feedFilter === 'similar') {
      entries = entries.sort((a, b) => b.match.score - a.match.score);
    }

    renderSimilarInfoBar();

    if (entries.length === 0) {
      feedGrid.innerHTML = '<p class="feed-empty">이 조건에 맞는 코디가 아직 없어요. 다른 필터를 선택해보세요.</p>';
    }

    entries.forEach(({ post, match }) => {
      const card = document.createElement('div');
      card.className = 'feed-card';
      card.innerHTML = `
        <div class="feed-img-box" onclick="openOotdDetail('${post.id}')">
          <img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.desc)}" loading="lazy">
          <span class="card-tag-badge">${escapeHtml(post.category)}</span>
          ${state.feedFilter === 'similar' ? `<span class="card-match-score" title="기본 프로필 매칭 점수 (규칙 기반)">매칭 ${match.score}점</span>` : ''}

          <!-- 착장 태그 핀 -->
          ${pinHtml(post.items[0], 'pin-1')}
          ${pinHtml(post.items[1], 'pin-2')}

          <button class="card-scrap-btn ${post.isScrapped ? 'scrapped' : ''}" onclick="event.stopPropagation(); toggleCardScrap('${post.id}', this)" title="스크랩">
            <i data-lucide="bookmark"></i>
          </button>
        </div>

        <div class="feed-card-body" onclick="openOotdDetail('${post.id}')">
          <div class="feed-user-meta">
            <img src="${escapeHtml(post.avatar)}" alt="${escapeHtml(post.author)}" class="feed-user-avatar">
            <span class="feed-user-name">${escapeHtml(post.author)}</span>
            <span class="feed-user-specs">• ${escapeHtml(post.ageLabel)}</span>
          </div>
          ${match?.label ? `<span class="similar-badge"><i data-lucide="users"></i> ${match.label}</span>` : ''}
          <div class="fit-spec-chips">${profileChipsHtml(post)}</div>
          <p class="feed-card-desc">${escapeHtml(post.desc)}</p>
          ${post.review ? `<p class="feed-fit-review">💬 ${escapeHtml(post.review)}</p>` : ''}
          <div class="feed-item-tags-snippet">
            🏷️ ${post.items.map(i => escapeHtml(itemName(i) + (i.size ? ` (${i.size})` : ''))).join(' / ')}
          </div>
          <div class="feed-card-footer">
            <div class="stat-group">
              <i data-lucide="heart"></i> <span>${post.likes}</span>
            </div>
            <div class="stat-group">
              <i data-lucide="bookmark"></i> <span>${post.scraps}</span>
            </div>
            <div class="stat-group">
              <i data-lucide="message-square"></i> <span>${post.comments.length}</span>
            </div>
          </div>
        </div>
      `;
      feedGrid.appendChild(card);
    });

    refreshIcons();
  };

  window.applyFeedFilter = (filterKey, el) => {
    if (filterKey === 'similar' && !state.userProfile.saved) {
      openProfileModal();
      showToast('info', '내 프로필이 필요해요', '키·사이즈·체형·퍼스널컬러를 저장하면 나와 비슷한 사람의 코디를 먼저 보여드려요.');
      return;
    }
    state.feedFilter = filterKey;
    document.querySelectorAll('.filter-chip').forEach(btn => {
      btn.classList.toggle('active', el ? btn === el : btn.dataset.filter === filterKey);
    });
    renderFeed();
  };

  window.filterByTone = (tone) => {
    applyFeedFilter(tone);
  };

  window.showSimilarFeed = () => {
    if (state.currentNav !== 'feed') switchNav('feed');
    applyFeedFilter('similar');
    if (state.feedFilter === 'similar') {
      setTimeout(() => {
        const bar = document.getElementById('similar-info-bar');
        if (!bar) return;
        // 고정 헤더(68px)와 필터 바 높이만큼 여유를 둔다
        const top = bar.getBoundingClientRect().top + window.scrollY - 150;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 80);
    }
  };

  window.toggleCardScrap = (postId, btn) => {
    const post = state.posts.find(p => p.id === postId);
    if (!post) return;
    post.isScrapped = !post.isScrapped;
    post.scraps += post.isScrapped ? 1 : -1;
    btn.classList.toggle('scrapped', post.isScrapped);
    showToast('info', '스크랩 보관함', post.isScrapped ? '마이페이지 스크랩북에 저장되었습니다.' : '스크랩이 취소되었습니다.');
    renderFeed();
  };

  // =========================================================================
  // 4. OOTD 상세 모달 & 댓글 인터랙션
  // =========================================================================
  window.openOotdDetail = (postId) => {
    const post = state.posts.find(p => p.id === postId);
    if (!post) return;
    state.activeDetailPost = post;

    document.getElementById('detail-img').src = post.image;
    document.getElementById('detail-author-avatar').src = post.avatar;
    document.getElementById('detail-author-name').textContent = post.author;
    document.getElementById('detail-desc').textContent = post.desc;

    const match = state.userProfile.saved ? scoreSimilarity(state.userProfile, post) : null;
    document.getElementById('detail-author-specs').textContent = match
      ? `${post.ageLabel} · 기본 프로필 매칭 ${match.score}점${match.label ? ` · ${match.label}` : ''}`
      : post.ageLabel;
    document.getElementById('detail-fit-chips').innerHTML = profileChipsHtml(post);

    const reviewEl = document.getElementById('detail-review');
    reviewEl.style.display = post.review ? 'block' : 'none';
    reviewEl.innerHTML = post.review ? `<strong>💬 실제 착용 후기</strong><p>${escapeHtml(post.review)}</p>` : '';

    // 사진 위 태그 핀을 이 게시물의 착용 제품으로 채움
    [1, 2].forEach(n => {
      const item = post.items[n - 1];
      const pin = document.getElementById(`tag-pin-${n}`);
      if (pin) pin.style.display = item ? '' : 'none';
      const pop = document.getElementById(`pin-popover-${n}`);
      if (pop && item) {
        pop.innerHTML = `
          <span class="pin-brand">${escapeHtml(item.brand || '착용 제품')}</span>
          <strong class="pin-title">${escapeHtml(item.title)}</strong>
          <span class="pin-price">${item.size ? `사이즈 ${escapeHtml(item.size)}` : ''}${item.price ? ` · ₩ ${escapeHtml(item.price)}` : ''}</span>
        `;
      }
    });

    // 착장 아이템 목록
    const itemsListEl = document.getElementById('detail-items-list');
    itemsListEl.innerHTML = post.items.map(item => `
      <div style="font-size:12.5px; padding:4px 0;">
        ${item.brand ? `<span style="color:var(--primary); font-weight:700;">[${escapeHtml(item.brand)}]</span>` : ''}
        <strong>${escapeHtml(item.title)}</strong>${item.size ? ` · 착용 사이즈 <strong>${escapeHtml(item.size)}</strong>` : ''}${item.price ? ` - ₩${escapeHtml(item.price)}` : ''}
      </div>
    `).join('');

    // 좋아요 및 스크랩 버튼 상태
    document.getElementById('detail-likes-count').textContent = post.likes;
    document.getElementById('detail-scraps-count').textContent = post.scraps;
    document.getElementById('detail-comment-count').textContent = post.comments.length;

    renderDetailComments();
    openModal('ootd-detail-modal');
  };

  const renderDetailComments = () => {
    if (!state.activeDetailPost) return;
    const listEl = document.getElementById('detail-comments-list');
    listEl.innerHTML = state.activeDetailPost.comments.map(c => `
      <div class="comment-row">
        <strong>${escapeHtml(c.author)}</strong> <span>${escapeHtml(c.text)}</span>
      </div>
    `).join('');
  };

  window.submitComment = () => {
    const input = document.getElementById('new-comment-input');
    const text = input.value.trim();
    if (!text || !state.activeDetailPost) return;

    state.activeDetailPost.comments.push({
      author: state.currentUser.nickname,
      text: text
    });
    input.value = '';
    renderDetailComments();
    document.getElementById('detail-comment-count').textContent = state.activeDetailPost.comments.length;
    renderFeed();
  };

  window.likeCurrentPost = () => {
    if (!state.activeDetailPost) return;
    state.activeDetailPost.isLiked = !state.activeDetailPost.isLiked;
    state.activeDetailPost.likes += state.activeDetailPost.isLiked ? 1 : -1;
    document.getElementById('detail-likes-count').textContent = state.activeDetailPost.likes;
    renderFeed();
  };

  window.scrapCurrentPost = () => {
    if (!state.activeDetailPost) return;
    state.activeDetailPost.isScrapped = !state.activeDetailPost.isScrapped;
    state.activeDetailPost.scraps += state.activeDetailPost.isScrapped ? 1 : -1;
    document.getElementById('detail-scraps-count').textContent = state.activeDetailPost.scraps;
    showToast('info', '스크랩 완료', '마이페이지에 코디가 저장되었습니다.');
    renderFeed();
  };

  window.toggleFollow = (btn) => {
    const isFollowing = btn.classList.toggle('following');
    btn.textContent = isFollowing ? '팔로잉' : '팔로우';
    showToast('info', '팔로우 상태 변경', isFollowing ? '해당 회원을 팔로우합니다.' : '팔로우를 취소했습니다.');
  };

  window.sharePost = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('info', '링크 복사 완료', '코디 링크가 클립보드에 복사되었습니다.');
  };

  // =========================================================================
  // 5. 내 코디 자랑하기 (새 글 작성 모달)
  // =========================================================================
  document.getElementById('open-upload-modal-btn')?.addEventListener('click', () => {
    openModal('upload-modal');
  });
  document.getElementById('story-add-trigger')?.addEventListener('click', () => {
    openModal('upload-modal');
  });

  window.pickSamplePhoto = (imgEl) => {
    document.querySelectorAll('.sample-thumb').forEach(t => t.classList.remove('selected'));
    imgEl.classList.add('selected');
    document.getElementById('post-img-url').value = imgEl.src;
  };

  // 업로드 폼을 내 매칭 프로필 값으로 채움 (사용자가 이미 고친 값은 유지)
  const prefillUploadForm = () => {
    const modal = document.getElementById('upload-modal');
    if (!modal || modal.dataset.dirty === 'true') return;
    const p = state.userProfile;
    document.getElementById('post-height').value = p.height || '';
    document.getElementById('post-top-size').value = p.topSize || 'M';
    document.getElementById('post-bottom-size').value = p.bottomSize || '28';
    document.getElementById('post-body-type').value = p.bodyType || '웨이브';
    document.getElementById('post-tone').value = p.tone || '여름쿨톤';
  };
  document.getElementById('upload-modal')?.addEventListener('input', (e) => {
    e.currentTarget.dataset.dirty = 'true';
  });

  // "자라 크롭 가디건 (M) / 코스 슬랙스 (28)" → [{ title, size }]
  const parseWornItems = (text) => text.split('/')
    .map(part => part.trim())
    .filter(Boolean)
    .map(part => {
      const m = part.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
      return { brand: '', title: m ? m[1] : part, size: m ? m[2] : '' };
    });

  window.submitNewOotd = () => {
    const imgUrl = document.getElementById('post-img-url').value.trim();
    const height = parseInt(document.getElementById('post-height').value, 10);
    const tagItem = document.getElementById('post-tag-item').value.trim();
    const review = document.getElementById('post-review').value.trim();
    const content = document.getElementById('post-content').value.trim();

    if (!imgUrl || !content) {
      alert('사진과 코디 코멘트를 입력해주세요!');
      return;
    }
    if (!height || height < 130 || height > 200) {
      alert('키를 130~200cm 사이로 입력해주세요. 나와 비슷한 사람 매칭에 사용됩니다.');
      return;
    }

    const newPost = {
      id: `post-${Date.now()}`,
      author: state.currentUser.nickname,
      avatar: state.currentUser.avatar,
      ageLabel: ageLabelOf(state.userProfile.ageGroup),
      height,
      topSize: document.getElementById('post-top-size').value,
      bottomSize: document.getElementById('post-bottom-size').value,
      category: document.getElementById('post-category').value,
      tone: document.getElementById('post-tone').value,
      bodyType: document.getElementById('post-body-type').value,
      image: imgUrl,
      desc: content,
      review,
      items: parseWornItems(tagItem),
      likes: 1,
      isLiked: false,
      scraps: 0,
      isScrapped: false,
      comments: []
    };

    // 피드 최상단 추가 (백엔드가 없어 새로고침하면 사라짐)
    state.posts.unshift(newPost);
    document.getElementById('upload-modal').dataset.dirty = 'false';
    document.getElementById('post-content').value = '';
    document.getElementById('post-review').value = '';
    closeModal('upload-modal');
    renderFeed();
    showToast('sale', '🎉 코디 자랑 완료!', '피드에 등록되었습니다. (MVP: 게시물 DB가 없어 새로고침하면 사라져요)');
  };

  // =========================================================================
  // 6. 스타일 커뮤니티 (Q&A / 고민글)
  // =========================================================================
  const renderCommunity = (cat = 'all') => {
    const listEl = document.getElementById('community-posts-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    const filtered = cat === 'all' 
      ? state.communityPosts 
      : state.communityPosts.filter(p => p.category === cat);

    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = 'comm-post-card';
      card.onclick = () => {
        showToast('info', '게시글 열람', escapeHtml(`[${p.category}] ${p.title}`));
      };
      card.innerHTML = `
        <span class="comm-cat-badge">${escapeHtml(p.category)}</span>
        <h4 class="comm-post-title">${escapeHtml(p.title)}</h4>
        <p class="comm-post-body">${escapeHtml(p.body)}</p>
        <div class="comm-post-footer">
          <div class="comm-author-box">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" class="comm-author-avatar" alt="작성자">
            <span>${escapeHtml(p.author)}</span> • <span>${escapeHtml(p.time)}</span>
          </div>
          <div class="comm-stats">
            <span><i data-lucide="thumbs-up"></i> ${p.likes}</span>
            <span><i data-lucide="message-square"></i> ${p.commentsCount}</span>
          </div>
        </div>
      `;
      listEl.appendChild(card);
    });

    refreshIcons();
  };

  window.filterCommunity = (cat, el) => {
    document.querySelectorAll('.comm-tab').forEach(t => t.classList.remove('active'));
    if (el) el.classList.add('active');
    renderCommunity(cat);
  };

  window.openCommunityPostModal = () => {
    openModal('comm-post-modal');
  };

  window.submitCommunityPost = () => {
    const cat = document.getElementById('comm-category-select').value;
    const title = document.getElementById('comm-title-input').value.trim();
    const body = document.getElementById('comm-body-input').value.trim();

    if (!title || !body) {
      alert('제목과 내용을 입력해주세요!');
      return;
    }

    state.communityPosts.unshift({
      id: `comm-${Date.now()}`,
      category: cat,
      title: title,
      body: body,
      author: state.currentUser.nickname,
      likes: 0,
      commentsCount: 0,
      time: '방금 전'
    });

    closeModal('comm-post-modal');
    renderCommunity();
    showToast('info', '글 등록 완료', '패션 커뮤니티에 질문이 등록되었습니다.');
  };

  // =========================================================================
  // 7. 자가응답 기반 퍼스널 스타일 문진 (응답을 저장하고 실제로 집계)
  // =========================================================================
  const tallyUndertone = (answers) => {
    let cool = 0;
    let warm = 0;
    [answers.metal, answers.sunburn].forEach(v => {
      if (v === 'cool') cool++;
      if (v === 'warm') warm++;
    });
    return { cool, warm };
  };

  const aiSteps = [
    {
      key: 'metal',
      msg: () => `반갑습니다! 오늘의 OOTD 스타일 가이드 릴리예요 😊<br>
            <strong>평소 착용 습관과 피부 반응에 대한 5가지 질문</strong>에 답해주시면, 응답을 집계해 퍼스널컬러·체형 방향을 정리해드릴게요.<br>
            <span class="chat-mvp-note">※ MVP 버전: 자가응답과 기본 추천 규칙으로 결과를 만들며, AI 분석 모델은 개발·검증 예정입니다.</span><br><br>
            첫 번째 질문입니다. <strong>골드(노란 금) 목걸이가 화사한가요, 아니면 실버/화이트골드를 해야 피부가 맑아 보이나요?</strong>`,
      options: [
        { label: '✨ 은이나 백금이 훨씬 깨끗해 보여요 (실버)', val: 'cool', keywords: ['실버', '백금', '화이트골드', '은색', '은이'] },
        { label: '🌟 노란 골드가 피부에 따뜻하게 붙어요 (골드)', val: 'warm', keywords: ['골드', '금', '노란'] },
        { label: '🤔 둘 다 무난하고 로즈골드를 주로 껴요', val: 'neutral', keywords: ['로즈', '둘 다', '둘다', '무난', '모르'] }
      ]
    },
    {
      key: 'sunburn',
      msg: () => `두 번째 질문이에요. <strong>여름철 햇볕에 피부가 탔을 때 주로 어떻게 반응하나요?</strong>`,
      options: [
        { label: '☀️ 붉게 익고 따갑다가 벗겨져요', val: 'cool', keywords: ['붉', '빨갛', '빨개', '따갑', '벗겨'] },
        { label: '🏖️ 붉은 기 없이 곧바로 까맣게 타요', val: 'warm', keywords: ['까맣', '까매', '검게', '그을', '갈색'] }
      ]
    },
    {
      key: 'contrast',
      msg: (answers) => {
        const { cool, warm } = tallyUndertone(answers);
        return `지금까지 응답은 <strong>쿨 쪽 ${cool}개 · 웜 쪽 ${warm}개</strong>예요.<br>
            세 번째 질문입니다. <strong>밝고 부드러운 컬러(라벤더·피치 등)와 진하고 선명한 컬러(버건디·카키·블랙 등) 중, 얼굴이 더 생기 있어 보이는 쪽은?</strong>`;
      },
      options: [
        { label: '🌷 밝고 부드러운 파스텔 쪽이 잘 받아요', val: 'light', keywords: ['밝', '파스텔', '부드러', '연한', '연하'] },
        { label: '🍷 진하고 선명한 컬러가 더 또렷해 보여요', val: 'deep', keywords: ['진하', '진한', '선명', '어두', '짙'] }
      ]
    },
    {
      key: 'body',
      msg: () => `이제 <strong>체형</strong> 질문입니다. 체중이 늘었을 때 주로 <strong>어느 부위에 먼저 살이 붙나요?</strong>`,
      options: [
        { label: '🍐 엉덩이, 허벅지, 아랫배 등 하체 중심 (웨이브형)', val: '웨이브', keywords: ['하체', '엉덩이', '허벅지', '아랫배', '웨이브'] },
        { label: '🍎 목덜미, 가슴, 윗배 등 상체 중심 (스트레이트형)', val: '스트레이트', keywords: ['상체', '가슴', '윗배', '목덜미', '스트레이트'] },
        { label: '🦴 몸 전체에 고루 붙거나 뼈마디가 도드라짐 (내추럴형)', val: '내추럴', keywords: ['전체', '고루', '골고루', '뼈', '내추럴'] }
      ]
    },
    {
      key: 'neckline',
      msg: () => `마지막 질문입니다! <strong>셔츠 윗단추를 1~2개 풀어 쇄골을 보여주는 쪽과, 끝까지 단정하게 채우는 쪽 중 어느 쪽이 더 잘 어울리나요?</strong>`,
      options: [
        { label: '🪞 단추를 풀어 쇄골을 보여줘야 시원해 보여요', val: 'open', keywords: ['풀', '열', '쇄골', '시원'] },
        { label: '👔 단추를 끝까지 단정하게 채우는 게 더 어울려요', val: 'closed', keywords: ['채우', '채워', '단정', '잠그', '잠가'] }
      ]
    }
  ];

  // 응답 → 결과. 쿨/웜 동점이면 햇볕 반응(피부 반응) 응답을 우선한다.
  const computeDiagnosis = (answers) => {
    const { cool, warm } = tallyUndertone(answers);
    const tie = cool === warm;
    let undertone = cool > warm ? 'cool' : 'warm';
    if (tie) undertone = answers.sunburn || 'cool';
    const light = answers.contrast !== 'deep';

    let personaKey;
    if (undertone === 'cool') personaKey = light ? 'summer_cool_wave' : 'winter_cool_straight';
    else personaKey = light ? 'spring_warm_straight' : 'autumn_warm_natural';

    return {
      personaKey,
      body: answers.body || '웨이브',
      tally: { cool, warm, tie }
    };
  };

  const saveDiagnosis = () => {
    writeStore(DIAGNOSIS_KEY, {
      answers: state.diagnosisAnswers,
      diagnosis: state.diagnosis,
      personaKey: state.currentPersona
    });
  };

  const appendChatBubble = (who, html) => {
    const chatMsgArea = document.getElementById('ai-chat-messages');
    if (!chatMsgArea) return;
    const row = document.createElement('div');
    row.className = `chat-bubble-row ${who}`;
    row.innerHTML = who === 'ai'
      ? `<div class="bubble-avatar">릴리</div><div class="bubble-content">${html}</div>`
      : `<div class="bubble-content">${html}</div>`;
    chatMsgArea.appendChild(row);
    chatMsgArea.scrollTop = chatMsgArea.scrollHeight;
  };

  const renderAiChatStep = () => {
    const chipsBox = document.getElementById('ai-quick-chips');
    if (!chipsBox) return;

    if (state.aiStep >= aiSteps.length) {
      finishAiDiagnosis();
      return;
    }

    const step = aiSteps[state.aiStep];
    appendChatBubble('ai', step.msg(state.diagnosisAnswers));

    chipsBox.innerHTML = '';
    step.options.forEach(opt => {
      const chip = document.createElement('button');
      chip.className = 'ai-chip';
      chip.textContent = opt.label;
      chip.onclick = () => handleAiUserAnswer(opt.label, opt.val);
      chipsBox.appendChild(chip);
    });
  };

  const handleAiUserAnswer = (text, val) => {
    const step = aiSteps[state.aiStep];
    if (!step) return;

    appendChatBubble('user', escapeHtml(text));
    document.getElementById('ai-quick-chips').innerHTML = '';

    state.diagnosisAnswers[step.key] = val;
    updateMorphingAvatar(step.key, val);

    state.aiStep++;
    setTimeout(renderAiChatStep, 500);
  };

  // 자유 입력·음성은 현재 질문의 보기 키워드와 맞을 때만 응답으로 인정한다
  const handleFreeTextAnswer = (text) => {
    const step = aiSteps[state.aiStep];
    if (!step) {
      appendChatBubble('user', escapeHtml(text));
      appendChatBubble('ai', "문진이 끝났어요. 새로 하시려면 상단의 <strong>'다시 진단하기'</strong>를 눌러주세요.");
      return;
    }
    const matched = step.options.find(opt => opt.keywords.some(k => text.includes(k)));
    if (matched) {
      handleAiUserAnswer(text, matched.val);
      return;
    }
    appendChatBubble('user', escapeHtml(text));
    appendChatBubble('ai', 'MVP 버전에서는 자유 문장을 이해하는 AI가 아직 연결되지 않았어요. 아래 보기 중 하나를 눌러 주시거나, 보기에 있는 단어로 짧게 답해주세요.');
  };

  const SHAPE_PATHS = {
    '웨이브': {
      torso: 'M68,102 Q100,99 132,102 L124,170 Q100,174 76,170 Z',
      pelvis: 'M76,170 Q100,174 124,170 L142,215 Q100,222 58,215 Z',
      label: '웨이브 (하체 곡선)'
    },
    '스트레이트': {
      torso: 'M58,100 Q100,96 142,100 L132,165 Q100,167 68,165 Z',
      pelvis: 'M68,165 Q100,167 132,165 L132,210 Q100,214 68,210 Z',
      label: '스트레이트 (상체 볼륨)'
    },
    '내추럴': {
      torso: 'M60,101 Q100,97 140,101 L130,166 Q100,169 70,166 Z',
      pelvis: 'M70,166 Q100,169 130,166 L138,211 Q100,216 62,211 Z',
      label: '내추럴 (프레임 강조)'
    }
  };

  const updateMorphingAvatar = (key, val) => {
    const skinStop1 = document.getElementById('skin-stop-1');
    const skinStop2 = document.getElementById('skin-stop-2');
    const liveToneVal = document.getElementById('live-tone-val');
    const liveShapeVal = document.getElementById('live-shape-val');
    const liveJewelVal = document.getElementById('live-jewel-val');

    if (key === 'tone') {
      const isCool = val === 'cool';
      skinStop1?.setAttribute('stop-color', isCool ? '#fff0ea' : '#fef3c7');
      skinStop2?.setAttribute('stop-color', isCool ? '#eed2cb' : '#fde68a');
      if (liveJewelVal) liveJewelVal.textContent = isCool ? '실버·화이트골드' : '옐로우골드';
      return;
    }
    if (key === 'metal' || key === 'sunburn') {
      const { cool, warm } = tallyUndertone(state.diagnosisAnswers);
      if (cool === warm) {
        if (liveToneVal) liveToneVal.textContent = `판단 보류 (쿨 ${cool} · 웜 ${warm})`;
        return;
      }
      const isCool = cool > warm;
      updateMorphingAvatar('tone', isCool ? 'cool' : 'warm');
      if (liveToneVal) liveToneVal.textContent = `${isCool ? '쿨' : '웜'} 쪽 응답 우세 (쿨 ${cool} · 웜 ${warm})`;
      return;
    }
    if (key === 'body') {
      const shape = SHAPE_PATHS[val];
      if (!shape) return;
      document.getElementById('morph-torso')?.setAttribute('d', shape.torso);
      document.getElementById('morph-pelvis')?.setAttribute('d', shape.pelvis);
      if (liveShapeVal) liveShapeVal.textContent = shape.label;
    }
  };

  const finishAiDiagnosis = () => {
    const result = computeDiagnosis(state.diagnosisAnswers);
    state.diagnosis = {
      completed: true,
      source: 'answers',
      body: result.body,
      tally: result.tally
    };
    changeDiagnosisPersona(result.personaKey);
    saveDiagnosis();

    const p = state.personas[result.personaKey];
    const { cool, warm, tie } = result.tally;
    appendChatBubble('ai', `
      📋 <strong>응답 집계가 끝났어요!</strong><br>
      쿨 쪽 응답 ${cool}개 · 웜 쪽 응답 ${warm}개${tie ? ' (동점이라 햇볕 반응 응답을 기준으로 판단)' : ''},
      컬러 명도 응답: ${state.diagnosisAnswers.contrast === 'deep' ? '진하고 선명한 쪽' : '밝고 부드러운 쪽'}<br>
      → <strong>${p.toneName}</strong> · <strong>${result.body} 체형</strong><br>
      결과가 다르게 느껴지면 결과 화면에서 <strong>직접 수정</strong>할 수 있어요.
    `);

    const resultArea = document.getElementById('ai-result-area');
    if (resultArea) {
      resultArea.style.display = 'block';
      resultArea.scrollIntoView({ behavior: 'smooth' });
    }
    showToast('sale', 'MVP 스타일 분석 결과가 생성되었습니다', `자가응답 기준: ${p.toneName} · ${result.body} 체형`);

    setTimeout(() => {
      openDiagnosisResultModal();
    }, 500);
  };

  window.resetAiChat = () => {
    state.aiStep = 0;
    state.diagnosisAnswers = { metal: null, sunburn: null, contrast: null, body: null, neckline: null };
    const chatMsgArea = document.getElementById('ai-chat-messages');
    if (chatMsgArea) chatMsgArea.innerHTML = '';
    ['live-tone-val', 'live-shape-val', 'live-jewel-val'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '응답 대기중';
    });
    renderAiChatStep();
  };

  const submitAiInput = () => {
    const input = document.getElementById('ai-user-input');
    const text = input.value.trim();
    if (!text) return;
    handleFreeTextAnswer(text);
    input.value = '';
  };
  document.getElementById('ai-send-btn')?.addEventListener('click', submitAiInput);
  document.getElementById('ai-user-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.isComposing) submitAiInput();
  });

  // 음성인식 (브라우저 내장 Web Speech API) → 보기 키워드 매칭
  const initAiMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const micBtn = document.getElementById('ai-mic-btn');
    const voiceBar = document.getElementById('voice-indicator');

    if (!SpeechRecognition || !micBtn) return;

    state.recognition = new SpeechRecognition();
    state.recognition.lang = 'ko-KR';

    state.recognition.onstart = () => {
      state.isRecording = true;
      micBtn.classList.add('listening');
      if (voiceBar) voiceBar.style.display = 'flex';
    };

    state.recognition.onresult = (e) => {
      handleFreeTextAnswer(e.results[0][0].transcript);
    };

    state.recognition.onend = () => {
      state.isRecording = false;
      micBtn.classList.remove('listening');
      if (voiceBar) voiceBar.style.display = 'none';
    };

    micBtn.addEventListener('click', () => {
      if (state.isRecording) {
        state.recognition.stop();
      } else {
        state.recognition.start();
      }
    });
  };
  initAiMic();

  // 사진 모드 토글
  window.setAiMode = (mode) => {
    document.getElementById('pill-chat-mode').classList.toggle('active', mode === 'chat');
    document.getElementById('pill-photo-mode').classList.toggle('active', mode === 'photo');
    document.getElementById('ai-chat-wrapper').style.display = mode === 'chat' ? 'grid' : 'none';
    document.getElementById('ai-photo-wrapper').style.display = mode === 'photo' ? 'block' : 'none';
  };

  // 사진은 현재 미리보기 + 향후 AI 분석을 위한 입력으로만 사용 (결과에 영향 없음)
  const registerStylePhoto = (target, dataUrl) => {
    state.photoInputs[target] = dataUrl;
    const label = target === 'face' ? '얼굴' : '전신';
    const statusEl = document.getElementById(`${target}-photo-status`);
    if (statusEl) statusEl.innerHTML = `<span style="color:#03c75a;">✔ ${label} 사진 등록됨 (미리보기)</span>`;
    const preview = document.getElementById(`${target}-photo-preview`);
    if (preview) {
      preview.src = dataUrl;
      preview.style.display = 'block';
    }
    const icon = document.getElementById(`${target}-photo-icon`);
    if (icon) icon.style.display = 'none';
    showToast('info', `${label} 사진 등록 완료`, '사진은 미리보기로만 사용되며, 사진 기반 AI 분석은 개발 예정입니다. 결과는 자가응답으로 만들어집니다.');
  };

  window.executePhotoScan = () => {
    if (!state.diagnosis.completed) {
      showToast('info', '자가응답 문진을 먼저 완료해주세요', '현재 MVP는 사진이 아닌 자가응답으로 스타일을 분석합니다. 5가지 질문에 답하면 결과를 볼 수 있어요.');
      setAiMode('chat');
      document.getElementById('ai-chat-wrapper')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    openDiagnosisResultModal();
  };

  // =========================================================================
  // 7-0. 신상 정보(성별/연령대/실측스펙) 제어
  // =========================================================================
  const syncProfileControls = () => {
    const { gender, ageGroup, height, weight } = state.userProfile;
    document.querySelectorAll('.gender-btn.male, .modal-sync-male').forEach(btn => {
      btn.classList.toggle('active', gender === 'male');
    });
    document.querySelectorAll('.gender-btn.female, .modal-sync-female').forEach(btn => {
      btn.classList.toggle('active', gender === 'female');
    });
    ['20s', '30s', '40s'].forEach(a => {
      document.querySelectorAll(`.age-chip-btn[data-age="${a}"], .modal-sync-age-${a}`).forEach(btn => {
        btn.classList.toggle('active', ageGroup === a);
      });
    });
    const hInput = document.getElementById('input-user-height');
    const wInput = document.getElementById('input-user-weight');
    if (hInput) hInput.value = height || '';
    if (wInput) wInput.value = weight || '';
  };

  window.setUserGender = (gender) => {
    state.userProfile.gender = gender;
    saveProfile();
    syncProfileControls();
    updateProfileNoticeText();
    changeDiagnosisPersona(state.currentPersona);
    showToast('info', '성별 설정 변경', `${gender === 'male' ? '남성 (MEN)' : '여성 (WOMEN)'} 기준 예시 상품으로 전환되었습니다.`);
  };

  window.setUserAgeGroup = (age) => {
    state.userProfile.ageGroup = age;
    saveProfile();
    syncProfileControls();
    updateProfileNoticeText();
    changeDiagnosisPersona(state.currentPersona);
    showToast('info', '연령대 설정 변경', `${age === '20s' ? '20대 트렌디' : age === '30s' ? '30대 컨템포러리 오피스' : '40대+ 클래식 프리미엄'} 스타일 기준으로 안내합니다.`);
  };

  window.updateUserSpecs = () => {
    const hInput = document.getElementById('input-user-height');
    const wInput = document.getElementById('input-user-weight');
    const h = parseInt(hInput?.value, 10);
    const w = parseInt(wInput?.value, 10);
    if (h >= 130 && h <= 200) state.userProfile.height = h;
    state.userProfile.weight = w > 0 ? w : null;
    saveProfile();
    updateProfileNoticeText();
    renderHeroProfile();
    renderFeed();
  };

  const updateProfileNoticeText = () => {
    const notice = document.getElementById('profile-notice-text');
    if (!notice) return;
    const isMale = state.userProfile.gender === 'male';
    const age = state.userProfile.ageGroup;
    let brandText = '';
    let styleText = '';

    if (isMale) {
      if (age === '20s') {
        brandText = '쿠어(COOR), 무신사스탠다드, 드로우핏, 아더에러';
        styleText = '트렌디 스트릿 & 세미와이드 캐주얼';
      } else if (age === '30s') {
        brandText = '포터리(POTTERY), 타임옴므, COS MEN, 닥터마틴';
        styleText = '컨템포러리 미니멀 & 세련된 비즈니스 캐주얼';
      } else {
        brandText = '솔리드옴므, 띠어리, 폴로 랄프로렌, 몽블랑';
        styleText = '품격 있는 클래식 테일러링 & 프리미엄 슬랙스';
      }
    } else {
      if (age === '20s') {
        brandText = '마뗑킴, 글로니, ZARA, 시에(SIE)';
        styleText = '트렌디 영캐주얼 & 감각적인 크롭/하이웨이스트';
      } else if (age === '30s') {
        brandText = 'COS, 마시모두띠, 프론트로우, 쿠에른, 골든듀';
        styleText = '우아한 세미포멀 & 오피스 컨템포러리 실루엣';
      } else {
        brandText = '타임(TIME), 르베이지, 구호(KUHO), 막스마라';
        styleText = '기품 있는 럭셔리 실루엣 & 캐시미어 프리미엄 핏';
      }
    }

    const { height, weight } = state.userProfile;
    notice.innerHTML = `💡 MVP 추천 규칙: <strong>${isMale ? '남성' : '여성'} ${ageLabelOf(age)}</strong> (${height}cm${weight ? ` / ${weight}kg` : ''}) 기준 <strong>${styleText}</strong> 방향으로 안내합니다. (참고 브랜드 예시: ${brandText})`;
  };

  // =========================================================================
  // 7-1. 분석 결과 렌더링 (퍼스널컬러 페르소나 + 체형을 따로 조합)
  // =========================================================================
  const answeredCount = () => Object.values(state.diagnosisAnswers).filter(Boolean).length;

  const basisHtml = () => {
    const d = state.diagnosis;
    const parts = [];
    if (d.completed) {
      const { cool, warm, tie } = d.tally;
      parts.push(`<span>근거: 자가응답 ${answeredCount()}/${aiSteps.length}개</span>`);
      parts.push(`<span>• 쿨 응답 ${cool} · 웜 응답 ${warm}${tie ? ' (동점 → 햇볕 반응 기준)' : ''}</span>`);
      parts.push(`<span>• 컬러 명도: ${state.diagnosisAnswers.contrast === 'deep' ? '진하고 선명한 쪽' : '밝고 부드러운 쪽'}</span>`);
      parts.push(`<span>• 체형 응답: ${escapeHtml(state.diagnosisAnswers.body || '-')}</span>`);
    } else if (d.source !== 'manual') {
      parts.push('<span>아직 자가응답 문진 전이에요. 기본 예시(여름 쿨톤 · 웨이브)로 표시 중입니다.</span>');
    }
    if (d.source === 'manual') parts.push('<span>• 사용자가 결과를 직접 수정함</span>');
    parts.push('<span class="basis-muted">• 사진 기반 측정: 개발 예정</span>');
    return parts.join('');
  };

  const resultStatusText = () => {
    if (state.diagnosis.source === 'manual') return '직접 수정한 MVP 스타일 분석 결과';
    if (state.diagnosis.completed) return 'MVP 스타일 분석 결과가 생성되었습니다';
    return '문진 전 · 기본 예시 결과';
  };

  const renderDiagnosisResult = () => {
    const key = state.currentPersona;
    const p = state.personas[key];
    const bodyKey = state.diagnosis.body;
    const b = state.personas[BODY_PERSONA[bodyKey]] || p;
    const profilePrefix = `${ageLabelOf(state.userProfile.ageGroup)} ${state.userProfile.gender === 'male' ? '남성' : '여성'}`;
    const bodyWords = b.bodyTags.map(t => t.replace('#', '')).join(' · ');
    const summary = `${TONE_SUMMARY[key]} 체형은 ${bodyWords} 조합을 추천해요.`;
    const necklineNote = state.diagnosisAnswers.neckline === 'open'
      ? ' (응답: 쇄골이 드러나는 넥라인 선호)'
      : state.diagnosisAnswers.neckline === 'closed' ? ' (응답: 단정하게 채우는 넥라인 선호)' : '';
    const paletteHtml = p.paletteDots.map(dot => `<span style="background: ${dot.color};" title="${dot.name}"></span>`).join('');
    const setText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    const setHtml = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };

    // 수정 칩 활성 상태
    document.querySelectorAll('.persona-chip[data-persona]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.persona === key);
    });
    document.querySelectorAll('.body-chip').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.body === bodyKey);
    });

    // 페이지 내부 결과 영역 (#ai-result-area)
    setText('page-result-badge', `자가응답 기반 퍼스널 스타일 분석 결과 · ${resultStatusText()}`);
    setHtml('page-result-title', `<span style="color:var(--primary); font-size:14px; display:block; margin-bottom:4px;">[${profilePrefix} · MVP 추천 로직 결과]</span>고객님을 위한 <span class="highlight-blue">${p.toneName} · ${bodyKey} 체형</span> 스타일 방향`);
    setText('page-result-desc', summary);
    setHtml('page-vision-metrics', basisHtml());

    setText('page-card1-title', `퍼스널 컬러: ${p.toneName}`);
    setText('page-card1-desc', TONE_SUMMARY[key]);
    setHtml('page-palette-dots', paletteHtml);
    setText('page-card2-title', `체형: ${b.bodyName}`);
    setText('page-card2-desc', b.bodyDesc);
    setHtml('page-card2-tags', b.bodyTags.map(tag => `<span>${tag}</span>`).join(' '));
    setText('page-card3-title', `주얼리 & 넥라인: ${p.jewelTags[0]}`);
    setText('page-card3-desc', p.jewelDesc + necklineNote);
    setHtml('page-card3-tags', p.jewelTags.map(tag => `<span>${tag}</span>`).join(' '));

    // 팝업 모달 (#diagnosis-result-modal)
    setText('modal-result-status', resultStatusText());
    setHtml('modal-result-title', `<span style="color:var(--primary); font-size:13px; display:block;">[${profilePrefix} · 자가응답 기준]</span>분석 결과: <strong style="color:var(--primary);">${p.toneName}</strong> · <strong style="color:var(--primary);">${bodyKey} 체형</strong>`);
    setText('modal-result-desc', summary);
    setHtml('modal-vision-metrics', basisHtml());
    setHtml('modal-tag-pills', `
      <span>#${profilePrefix.replace(/\s+/g, '_')}</span>
      <span>#${p.toneName.replace(/\s+/g, '')}</span>
      <span>#${bodyKey}체형</span>
      <span>#${b.bodyTags[0]?.replace('#', '') || '체형맞춤'}</span>
    `);
    setText('modal-card1-title', `🎨 베스트 컬러 팔레트 (${p.toneName})`);
    setText('modal-card1-desc', TONE_SUMMARY[key]);
    setHtml('modal-palette-dots', paletteHtml);
    setText('modal-card2-title', `👗 체형 보완 핏 공식 (${b.bodyName})`);
    setText('modal-card2-desc', b.bodyDesc);
    setHtml('modal-card2-tags', b.bodyTags.map(tag => `<span>${tag}</span>`).join(' '));
    setText('modal-card3-title', `💎 넥라인 & 주얼리 (${p.jewelTags[0]})`);
    setText('modal-card3-desc', p.jewelDesc + necklineNote);
    setHtml('modal-card3-tags', p.jewelTags.map(tag => `<span>${tag}</span>`).join(' '));

    // 일러스트 동기화 (문진을 마쳤거나 직접 수정한 경우에만)
    if (state.diagnosis.completed || state.diagnosis.source === 'manual') {
      updateMorphingAvatar('tone', PERSONA_TONE[key].includes('쿨') ? 'cool' : 'warm');
      updateMorphingAvatar('body', bodyKey);
      setText('live-tone-val', p.toneName);
    }

    renderCuratedShowroom();
    renderModalCuratedItems();
    refreshIcons();
  };

  // 퍼스널컬러(페르소나) 변경. opts.manual = 사용자가 결과를 직접 수정
  window.changeDiagnosisPersona = (personaKey, opts = {}) => {
    if (!state.personas[personaKey]) return;
    state.currentPersona = personaKey;
    if (opts.manual) {
      state.diagnosis.source = 'manual';
      saveDiagnosis();
    }
    renderDiagnosisResult();
  };

  window.setDiagnosisBody = (body) => {
    if (!BODY_PERSONA[body]) return;
    state.diagnosis.body = body;
    state.diagnosis.source = 'manual';
    saveDiagnosis();
    renderDiagnosisResult();
  };

  window.focusResultEditor = (editorId) => {
    const el = document.getElementById(editorId);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
  };

  // 분석 결과를 매칭 프로필 폼에 채워서 사용자가 확인 후 저장
  window.applyDiagnosisToProfile = () => {
    openProfileModal({
      tone: PERSONA_TONE[state.currentPersona],
      bodyType: state.diagnosis.body
    });
    showToast('info', '프로필에 반영할까요?', '퍼스널컬러·체형을 채워뒀어요. 키·사이즈를 확인하고 저장해주세요.');
  };

  // =========================================================================
  // 7-2. 스타일 분석 결과 모달 열기 & 쇼룸 아이템 렌더링
  // =========================================================================
  window.openDiagnosisResultModal = (photoUrl) => {
    const photo = photoUrl || state.photoInputs.face || state.photoInputs.body;
    const photoEl = document.getElementById('result-user-photo');
    const emptyEl = document.getElementById('result-photo-empty');
    if (photoEl) {
      if (photo) photoEl.src = photo;
      photoEl.style.display = photo ? 'block' : 'none';
    }
    if (emptyEl) emptyEl.style.display = photo ? 'none' : 'flex';

    renderDiagnosisResult();

    const resultArea = document.getElementById('ai-result-area');
    if (resultArea) {
      resultArea.style.display = 'block';
    }

    openModal('diagnosis-result-modal');
    refreshIcons();
  };

  // 쇼룸 카드: 예시 상품 데이터임을 명시
  const curatedCardHtml = (item) => `
    <div class="curated-img-wrap">
      <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=500&q=80';">
      <span class="curated-stock-badge sample">예시 상품</span>
    </div>
    <div class="curated-body">
      <span class="curated-brand">${item.brand}</span>
      <h5 class="curated-title">${item.title}</h5>
      <div class="curated-fit">
        ${item.fit}<br>
        <strong>${item.size}</strong>
      </div>
      <div class="curated-footer">
        <span class="curated-price">예시가 ₩ ${item.price.toLocaleString()}</span>
        <button class="single-add-btn" onclick="addToCart('${item.id}')">+ 담기</button>
      </div>
    </div>
  `;

  const renderCuratedGrid = (gridId) => {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = '';
    state.curatedItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'curated-card';
      card.innerHTML = curatedCardHtml(item);
      grid.appendChild(card);
    });
    refreshIcons();
  };

  const renderModalCuratedItems = () => renderCuratedGrid('modal-curated-items-grid');

  // =========================================================================
  // 7-3. 상품 URL 분석 MVP (샘플 상품만 지원, 실제 웹페이지를 읽지 않음)
  // =========================================================================
  const SAMPLE_PRODUCTS = {
    knit: {
      url: 'https://sample.ootd-demo/products/cashmere-vneck-knit',
      title: '캐시미어 브이넥 니트',
      price: '89,900원',
      neckline: 'V넥 (깊지 않은 V존, 목선 정돈)',
      tones: ['봄웜톤', '가을웜톤'],
      bodies: ['스트레이트'],
      toneText: '봄 웜톤 · 가을 웜톤에 추천 (피치·카멜 계열)',
      bodyText: '스트레이트 체형 추천 (상체 볼륨을 정돈하는 정핏)',
      img: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=300&q=80'
    },
    jacket: {
      url: 'https://sample.ootd-demo/products/tailored-single-jacket',
      title: '테일러드 싱글 2버튼 울 자켓',
      price: '248,000원',
      neckline: '테일러드 라펠 & 싱글 브레스트',
      tones: ['봄웜톤', '가을웜톤', '겨울쿨톤'],
      bodies: ['스트레이트', '내추럴'],
      toneText: '웜톤 · 겨울 쿨톤에 추천 (오트밀·블랙 계열)',
      bodyText: '스트레이트 · 내추럴 체형 추천 (어깨선이 정돈된 실루엣)',
      img: 'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?auto=format&fit=crop&w=300&q=80'
    },
    pants: {
      url: 'https://sample.ootd-demo/products/high-rise-wide-pants',
      title: '하이라이즈 플리츠 와이드 팬츠',
      price: '59,900원',
      neckline: '하이라이즈 허리선',
      tones: ['봄웜톤', '여름쿨톤', '가을웜톤', '겨울쿨톤'],
      bodies: ['웨이브'],
      toneText: '모든 톤에 무난 (차콜·블랙 모노톤)',
      bodyText: '웨이브 체형 추천 (골반·힙 라인을 부드럽게 커버)',
      img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=300&q=80'
    }
  };

  window.setSampleUrl = (sampleKey) => {
    const input = document.getElementById('custom-mall-url');
    const sample = SAMPLE_PRODUCTS[sampleKey];
    if (!input || !sample) return;
    input.value = sample.url;
    analyzeCustomMallUrl();
  };

  window.analyzeCustomMallUrl = () => {
    const input = document.getElementById('custom-mall-url');
    const resultBox = document.getElementById('url-analysis-result');
    if (!input || !resultBox) return;

    const url = input.value.trim();
    if (!url) {
      alert('샘플 상품 버튼을 눌러 분석 경험을 확인해보세요.');
      return;
    }

    resultBox.style.display = 'flex';
    const sample = Object.values(SAMPLE_PRODUCTS).find(s => s.url === url);
    if (!sample) {
      resultBox.innerHTML = `
        <div class="url-unsupported">
          <i data-lucide="info"></i>
          <p>현재 MVP에서는 샘플 상품을 이용한 분석 경험만 제공됩니다. 실제 쇼핑몰 상품 정보 연동은 제휴 및 API 구축 후 제공할 예정입니다.</p>
        </div>
      `;
      refreshIcons();
      return;
    }

    const profile = state.userProfile;
    let fitLine = '<span class="basis-muted">내 매칭 프로필을 저장하면, 내 체형·톤 기준 추천 여부도 함께 보여드려요.</span>';
    if (profile.saved) {
      const toneOk = !!profile.tone && sample.tones.includes(profile.tone);
      const bodyOk = sample.bodies.includes(profile.bodyType);
      fitLine = toneOk && bodyOk
        ? `<span style="color:var(--accent-green); font-weight:700;">내 프로필(${toneLabel(profile.tone)} · ${profile.bodyType}) 기준 추천 규칙에 맞아요</span>`
        : `<span style="color:var(--text-sub); font-weight:700;">내 프로필(${toneLabel(profile.tone) || '톤 미입력'} · ${profile.bodyType}) 기준으로는 ${bodyOk ? '체형은 맞지만 톤은' : toneOk ? '톤은 맞지만 체형은' : '톤·체형 모두'} 추천 규칙과 달라요</span>`;
    }

    resultBox.innerHTML = `
      <img src="${sample.img}" alt="샘플 상품" class="url-res-img">
      <div class="url-res-info">
        <h5>${sample.title} <span class="sample-data-badge">예시 데이터</span> <span style="color:var(--primary); font-size:12px; margin-left:4px;">예시가 ${sample.price}</span></h5>
        <p><strong>• 넥라인/실루엣:</strong> ${sample.neckline}</p>
        <p><strong>• 퍼스널컬러 추천:</strong> ${sample.toneText}</p>
        <p><strong>• 체형 추천:</strong> ${sample.bodyText}</p>
        <p><strong>• 내 기준:</strong> ${fitLine}</p>
      </div>
    `;
  };

  // =========================================================================
  // 8. 맞춤 큐레이션 쇼룸 & 스마트 장바구니
  // =========================================================================
  const renderCuratedShowroom = () => renderCuratedGrid('curated-items-grid');

  window.addToCart = (itemId) => {
    const item = state.curatedItems.find(i => i.id === itemId);
    if (!item) return;

    if (!state.cart.some(c => c.id === item.id)) {
      state.cart.push(item);
      updateCartBadge();
      showToast('sale', '장바구니 담김', `[${item.brand}] ${item.title}을(를) 담았어요. 향후 가격·품절 알림을 받을 수 있습니다. (현재는 기능 데모)`);
    } else {
      showToast('info', '알림', '이미 장바구니에 보관 중인 아이템입니다.');
    }
  };

  window.addAllCuratedToCart = () => {
    state.curatedItems.forEach(item => {
      if (!state.cart.some(c => c.id === item.id)) {
        state.cart.push(item);
      }
    });
    updateCartBadge();
    showToast('sale', '풀착장 5종 담기 완료', '향후 가격·품절 알림을 받을 수 있습니다. 현재는 알림 기능 데모로, 실제 가격·재고는 확인하지 않습니다.');
    openCartDrawer();
  };

  const updateCartBadge = () => {
    const count = state.cart.length;
    document.getElementById('cart-badge').textContent = count;
    document.getElementById('m-cart-badge').textContent = count;
    renderCartDrawerItems();
  };

  const renderCartDrawerItems = () => {
    const listEl = document.getElementById('cart-drawer-items');
    const totalEl = document.getElementById('cart-drawer-total');
    if (!listEl || !totalEl) return;

    if (state.cart.length === 0) {
      listEl.innerHTML = `
        <div style="text-align:center; padding:50px 20px; color:var(--text-sub);">
          <i data-lucide="shopping-bag" style="width:40px; height:40px; margin-bottom:10px;"></i>
          <p>장바구니가 비어 있습니다.<br>맞춤 쇼룸에서 마음에 드는 예시 상품을 담아보세요.</p>
        </div>
      `;
      totalEl.textContent = '₩ 0';
    } else {
      let total = 0;
      listEl.innerHTML = state.cart.map(item => {
        total += item.price;
        return `
          <div class="drawer-item-card">
            <img src="${item.image}" alt="${item.title}" class="drawer-item-img">
            <div class="drawer-item-info">
              <span class="drawer-item-brand">${item.brand}</span>
              <h5 class="drawer-item-title">${item.title}</h5>
              <div class="drawer-item-price">₩ ${item.price.toLocaleString()}</div>
            </div>
            <button class="drawer-item-delete" onclick="removeFromCart('${item.id}')">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        `;
      }).join('');
      totalEl.textContent = `₩ ${total.toLocaleString()}`;
    }
    refreshIcons();
  };

  window.removeFromCart = (itemId) => {
    state.cart = state.cart.filter(i => i.id !== itemId);
    updateCartBadge();
  };

  window.openCartDrawer = () => {
    document.getElementById('cart-drawer').classList.add('open');
    renderCartDrawerItems();
  };

  window.closeCartDrawer = () => {
    document.getElementById('cart-drawer').classList.remove('open');
  };

  document.getElementById('cart-drawer-open-btn')?.addEventListener('click', openCartDrawer);

  // 가격·품절 알림 기능 데모 (실제 가격·재고를 조회하지 않는 화면 예시)
  window.simulatePriceDrop = () => {
    showToast(
      'sale',
      '<span class="demo-badge">DEMO</span> 세일 알림 예시',
      '담아둔 상품의 가격이 내려가면 이렇게 알려드릴 예정이에요. (예시: ₩135,000 → ₩94,500, 실제 가격 아님)'
    );
  };

  window.simulateLowStock = () => {
    showToast(
      'stock',
      '<span class="demo-badge">DEMO</span> 품절임박 알림 예시',
      '내 사이즈 재고가 얼마 남지 않으면 이렇게 알려드릴 예정이에요. (예시 화면, 실제 재고 아님)'
    );
  };

  // =========================================================================
  // 9. 사용자 인증 (로그인 / 회원가입)
  // =========================================================================
  const updateAuthUI = () => {
    const authBox = document.getElementById('auth-box');
    if (!authBox) return;

    if (state.currentUser.isLoggedIn) {
      authBox.innerHTML = `
        <div class="user-logged-profile" onclick="openProfileModal()" title="내 매칭 프로필 편집">
          <img src="${state.currentUser.avatar}" alt="프로필" class="user-logged-avatar">
          <span class="user-logged-name">${escapeHtml(state.currentUser.nickname)}</span>
        </div>
      `;
    } else {
      authBox.innerHTML = `
        <button class="login-trigger-btn" onclick="openModal('auth-modal')">로그인 / 회원가입</button>
      `;
    }
  };

  document.getElementById('open-login-btn')?.addEventListener('click', () => {
    openModal('auth-modal');
  });

  window.switchAuthTab = (tab) => {
    document.getElementById('tab-login').classList.toggle('active', tab === 'login');
    document.getElementById('tab-register').classList.toggle('active', tab === 'register');
    document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('register-form').style.display = tab === 'register' ? 'block' : 'none';
  };

  window.doLogin = () => {
    const email = document.getElementById('login-email').value;
    state.currentUser.isLoggedIn = true;
    state.currentUser.nickname = email.split('@')[0];
    updateAuthUI();
    closeModal('auth-modal');
    showToast('info', '로그인 완료 (데모)', `${escapeHtml(state.currentUser.nickname)}님 환영합니다! 회원 DB 연동 전이라 실제 계정 확인은 하지 않습니다.`);
  };

  window.doRegister = () => {
    const nick = document.getElementById('reg-nickname').value || '뉴_패셔니스타';
    const specs = document.getElementById('reg-specs').value || '';
    const tone = document.getElementById('reg-tone').value;

    state.currentUser.isLoggedIn = true;
    state.currentUser.nickname = nick;

    // 가입 시 입력한 키·퍼스널컬러는 매칭 프로필에도 반영
    const heightMatch = specs.match(/(\d{3})\s*cm/);
    const weightMatch = specs.match(/(\d{2,3})\s*kg/);
    if (heightMatch) state.userProfile.height = parseInt(heightMatch[1], 10);
    if (weightMatch) state.userProfile.weight = parseInt(weightMatch[1], 10);
    if (tone !== '잘모름') state.userProfile.tone = tone;
    saveProfile();
    syncProfileControls();
    updateProfileNoticeText();
    renderHeroProfile();

    updateAuthUI();
    closeModal('auth-modal');
    showToast('sale', '회원가입 완료 (데모)', `${escapeHtml(nick)}님 환영해요! 매칭 프로필에서 사이즈·체형도 입력해보세요.`);
  };

  window.doSocialLogin = (platform) => {
    state.currentUser.isLoggedIn = true;
    state.currentUser.nickname = `${platform}_패셔너`;
    updateAuthUI();
    closeModal('auth-modal');
    showToast('sale', '간편 로그인', `${platform} 계정으로 로그인되었습니다.`);
  };

  // =========================================================================
  // 10. 모달 공통 헬퍼 & 토스트
  // =========================================================================
  window.openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      if (modalId === 'upload-modal') prefillUploadForm();
      modal.classList.add('open');
      refreshIcons();
    }
  };

  window.closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('open');
  };

  // 모달 바깥 배경 클릭 시 닫기
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
      }
    });
  });

  const showToast = (type, title, desc) => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `app-toast ${type}`;

    let iconName = 'bell';
    if (type === 'sale') iconName = 'sparkles';
    if (type === 'stock') iconName = 'alert-triangle';

    toast.innerHTML = `
      <div class="toast-icon-wrap">
        <i data-lucide="${iconName}"></i>
      </div>
      <div class="toast-text">
        <h6>${title}</h6>
        <p>${desc}</p>
      </div>
    `;
    container.appendChild(toast);
    refreshIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(30px)';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  };

  // =========================================================================
  // 11. 실시간 웹캠 및 스마트폰 카메라 촬영 로직
  // =========================================================================
  state.camera = {
    stream: null,
    facingMode: 'user', // 'user' (전면) or 'environment' (후면)
    target: 'ootd'       // 'ootd', 'face', 'body'
  };

  window.openCameraViewfinder = async (target = 'ootd') => {
    state.camera.target = target;
    const guideShape = document.getElementById('camera-guide-shape');
    const guideText = document.getElementById('camera-guide-text');
    const titleEl = document.getElementById('camera-modal-title');

    if (target === 'face') {
      titleEl.textContent = '얼굴 정면 촬영 (미리보기 · 향후 AI 분석용)';
      if (guideShape) {
        guideShape.style.borderRadius = '50%';
        guideShape.style.width = '200px';
        guideShape.style.height = '260px';
      }
      if (guideText) guideText.textContent = '얼굴을 원 안에 맞추고 턱 밑에 A4용지를 대주세요';
    } else if (target === 'body') {
      titleEl.textContent = '전신 실루엣 촬영 (미리보기 · 향후 AI 분석용)';
      if (guideShape) {
        guideShape.style.borderRadius = '20px';
        guideShape.style.width = '220px';
        guideShape.style.height = '340px';
      }
      if (guideText) guideText.textContent = '머리부터 발끝까지 전신이 들어가게 서주세요';
    } else {
      titleEl.textContent = '오늘의 코디 촬영 (OOTD 자랑용)';
      if (guideShape) {
        guideShape.style.borderRadius = '16px';
        guideShape.style.width = '240px';
        guideShape.style.height = '300px';
      }
      if (guideText) guideText.textContent = '거울 셀카나 오늘 착용한 옷이 잘 보이게 찍어주세요';
    }

    openModal('camera-modal');
    await startCameraStream();
  };

  const startCameraStream = async () => {
    const videoEl = document.getElementById('webcam-stream');
    const guideText = document.getElementById('camera-guide-text');
    if (!videoEl) return;

    if (guideText) guideText.innerHTML = '<span style="color:#ffb800;">⚡ 카메라를 연결하는 중입니다...</span>';

    if (state.camera.stream) {
      state.camera.stream.getTracks().forEach(t => t.stop());
      state.camera.stream = null;
    }

    // 비디오 속성 보강 (브라우저 자동재생 및 검은화면 방지 필수 속성)
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.autoplay = true;

    try {
      let stream = null;
      try {
        // 1차 시도: 세부 옵션
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: state.camera.facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch (e1) {
        // 2차 시도: 범용 기본 카메라
        console.warn('Fallback to basic video:', e1);
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      state.camera.stream = stream;
      videoEl.srcObject = stream;
      videoEl.style.transform = state.camera.facingMode === 'user' ? 'scaleX(-1)' : 'scaleX(1)';

      // 비디오 재생 시작 (검은 화면 방지)
      videoEl.onloadedmetadata = async () => {
        try {
          await videoEl.play();
          if (guideText) {
            guideText.textContent = state.camera.target === 'face' 
              ? '얼굴을 원 안에 맞추고 턱 밑에 A4용지를 대주세요' 
              : '화면에 맞춰 포즈를 취해주세요';
          }
        } catch (playErr) {
          console.error('Video play error:', playErr);
        }
      };

      try {
        await videoEl.play();
      } catch (err) {
        // loadedmetadata에서 재시도됨
      }

    } catch (err) {
      console.error('Camera permission or device error:', err);
      if (guideText) {
        guideText.innerHTML = `
          <div style="background:rgba(234,43,66,0.9); padding:8px 14px; border-radius:8px; line-height:1.4;">
            ⚠️ <strong>카메라 화면이 안 보이시나요?</strong><br>
            1. 브라우저 주소창 좌측 🔒 <strong>카메라 권한을 '허용'</strong>해주세요.<br>
            2. 노트북 상단의 <strong>물리적 웹캠 덮개(슬라이더)</strong>를 열어주세요.
          </div>
        `;
      }
      showToast('stock', '카메라 권한 확인', '브라우저 주소창 좌측 자물쇠(🔒) 아이콘을 눌러 카메라 권한을 허용해주세요.');
    }
  };

  window.toggleCameraFacing = async () => {
    state.camera.facingMode = state.camera.facingMode === 'user' ? 'environment' : 'user';
    await startCameraStream();
    showToast('info', '카메라 전환', state.camera.facingMode === 'user' ? '전면(셀카) 카메라' : '후면 카메라');
  };

  window.captureCurrentFrame = () => {
    const videoEl = document.getElementById('webcam-stream');
    const canvas = document.getElementById('camera-snapshot-canvas');
    if (!canvas) return;

    canvas.width = videoEl?.videoWidth || 640;
    canvas.height = videoEl?.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (state.camera.facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    if (videoEl && videoEl.videoWidth) {
      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    } else {
      // 카메라 가상 시뮬레이션 프레임
      ctx.fillStyle = '#fce7f3';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ea2b42';
      ctx.font = '24px sans-serif';
      ctx.fillText('📷 찰칵! 오늘의 코디 사진', 40, canvas.height / 2);
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    // 촬영 사진은 미리보기로만 사용한다 (픽셀 색으로 퍼스널컬러를 판정하지 않음)
    if (state.camera.target === 'ootd') {
      document.getElementById('post-img-url').value = dataUrl;
      const previewImg = document.getElementById('post-preview-img');
      if (previewImg) previewImg.src = dataUrl;
      closeCameraViewfinder();
      openModal('upload-modal');
      showToast('sale', '촬영 완료!', '방금 찍은 사진이 코디 자랑에 적용되었습니다. 내용을 작성하고 등록해보세요.');
    } else if (state.camera.target === 'face' || state.camera.target === 'body') {
      closeCameraViewfinder();
      registerStylePhoto(state.camera.target, dataUrl);
    }
  };

  window.closeCameraViewfinder = () => {
    if (state.camera.stream) {
      state.camera.stream.getTracks().forEach(t => t.stop());
      state.camera.stream = null;
    }
    closeModal('camera-modal');
  };

  window.handleNativePhotoUpload = (input, target = 'ootd') => {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const dataUrl = e.target.result;
      if (target === 'ootd') {
        document.getElementById('post-img-url').value = dataUrl;
        const previewImg = document.getElementById('post-preview-img');
        if (previewImg) previewImg.src = dataUrl;
        showToast('sale', '사진 등록 완료', '앨범에서 선택한 사진이 반영되었습니다.');
      } else {
        registerStylePhoto(target, dataUrl);
      }
      input.value = '';
    };
    reader.readAsDataURL(file);
  };

  // =========================================================================
  // 11-1. 내 매칭 프로필 (나와 비슷한 사람 찾기)
  // =========================================================================
  const populateSizeSelects = () => {
    document.querySelectorAll('.size-select-top').forEach(sel => {
      sel.innerHTML = TOP_SIZES.map(([v, label]) => `<option value="${v}">${label}</option>`).join('');
    });
    document.querySelectorAll('.size-select-bottom').forEach(sel => {
      sel.innerHTML = BOTTOM_SIZES.map(v => `<option value="${v}">${v} 인치</option>`).join('');
    });
  };

  const renderHeroProfile = () => {
    const box = document.getElementById('hero-profile-summary');
    if (!box) return;
    const p = state.userProfile;
    if (!p.saved) {
      box.innerHTML = `
        <p class="hero-profile-empty">아직 프로필이 없어요. 키·사이즈·체형·퍼스널컬러를 입력하면 나와 비슷한 사람의 코디를 먼저 보여드려요.</p>
        <button type="button" class="result-edit-btn" onclick="openProfileModal()"><i data-lucide="plus"></i> 프로필 만들기</button>
      `;
    } else {
      box.innerHTML = `
        <div class="fit-spec-chips">${profileChipsHtml(p)}</div>
        ${p.styles?.length ? `<p class="hero-profile-styles">선호 스타일: ${p.styles.map(escapeHtml).join(' · ')}</p>` : ''}
        <button type="button" class="result-edit-btn" onclick="openProfileModal()"><i data-lucide="pencil"></i> 프로필 수정</button>
      `;
    }
    refreshIcons();
  };

  const setChoiceActive = (containerId, values) => {
    document.querySelectorAll(`#${containerId} [data-value]`).forEach(btn => {
      btn.classList.toggle('active', values.includes(btn.dataset.value));
    });
  };

  window.openProfileModal = (overrides = {}) => {
    const p = { ...state.userProfile, ...overrides };
    document.getElementById('pf-height').value = p.height || '';
    document.getElementById('pf-weight').value = p.weight || '';
    document.getElementById('pf-top-size').value = p.topSize || 'M';
    document.getElementById('pf-bottom-size').value = p.bottomSize || '28';
    document.getElementById('pf-tone').value = p.tone || '';
    setChoiceActive('pf-body-choices', [p.bodyType]);
    setChoiceActive('pf-style-choices', p.styles || []);
    openModal('profile-modal');
  };

  document.getElementById('pf-body-choices')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-value]');
    if (btn) setChoiceActive('pf-body-choices', [btn.dataset.value]);
  });
  document.getElementById('pf-style-choices')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-value]');
    if (btn) btn.classList.toggle('active');
  });

  window.saveProfileFromModal = () => {
    const height = parseInt(document.getElementById('pf-height').value, 10);
    const weight = parseInt(document.getElementById('pf-weight').value, 10);
    if (!height || height < 130 || height > 200) {
      alert('키를 130~200cm 사이로 입력해주세요.');
      return;
    }
    const bodyBtn = document.querySelector('#pf-body-choices .active');

    Object.assign(state.userProfile, {
      height,
      weight: weight > 0 ? weight : null,
      topSize: document.getElementById('pf-top-size').value,
      bottomSize: document.getElementById('pf-bottom-size').value,
      bodyType: bodyBtn ? bodyBtn.dataset.value : '웨이브',
      tone: document.getElementById('pf-tone').value,
      styles: [...document.querySelectorAll('#pf-style-choices .active')].map(b => b.dataset.value)
    });
    saveProfile(true);

    syncProfileControls();
    updateProfileNoticeText();
    renderHeroProfile();
    closeModal('profile-modal');
    closeModal('diagnosis-result-modal');
    showToast('sale', '프로필 저장 완료', '이 브라우저에 저장했어요. 나와 비슷한 사람의 코디부터 보여드릴게요.');
    showSimilarFeed();
  };

  // 새로고침 후에도 문진 결과 유지
  const restoreDiagnosis = () => {
    const saved = readStore(DIAGNOSIS_KEY);
    if (!saved) return;
    if (saved.answers) Object.assign(state.diagnosisAnswers, saved.answers);
    if (saved.diagnosis) Object.assign(state.diagnosis, saved.diagnosis);
    if (saved.personaKey && state.femalePersonas[saved.personaKey]) state.currentPersona = saved.personaKey;
    // 완료된 문진이면 채팅을 처음부터 다시 묻지 않도록 결과 안내만 보여준다
    if (state.diagnosis.completed) state.aiStep = aiSteps.length;
  };

  // =========================================================================
  // 12. 초기 구동
  // =========================================================================
  if (window.innerWidth > 768) {
    document.body.classList.add('force-pc-mode');
    document.getElementById('btn-view-pc')?.classList.add('active');
    document.getElementById('btn-view-mobile')?.classList.remove('active');
  }

  loadProfile();
  restoreDiagnosis();
  populateSizeSelects();
  syncProfileControls();
  updateProfileNoticeText();
  renderHeroProfile();

  renderFeed();
  renderCommunity();
  if (state.diagnosis.completed) {
    appendChatBubble('ai', "지난번 문진 결과가 저장되어 있어요. 상단의 <strong>'내 스타일 분석 결과 보기'</strong>로 확인하거나, <strong>'다시 진단하기'</strong>로 새로 시작할 수 있어요.");
  } else {
    renderAiChatStep();
  }
  renderDiagnosisResult();
  updateAuthUI();
  updateCartBadge();
});
