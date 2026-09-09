/**
 * OOTD HOUSE - Today's House (오늘의집) Inspired Fashion Platform JavaScript
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
    posts: [
      {
        id: 'post-1',
        author: '소희_데일리',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
        specs: '163cm · 48kg · 여름쿨톤',
        category: '출근룩',
        tone: '여름쿨톤',
        bodyType: '웨이브체형',
        image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80',
        desc: '월요일 출근할 때 가장 손이 많이 가는 쿨톤 조합이에요! 차분한 소라색 셔츠에 하이웨이스트 슬랙스로 다리가 5cm는 더 길어 보여요 💙',
        items: [
          { brand: 'COS', title: '파인 팝클린 오버사이즈 셔츠', price: '115,000' },
          { brand: 'ZARA', title: '플루이드 와이드 하이라이즈 팬츠', price: '59,900' }
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
        specs: '168cm · 53kg · 가을웜톤',
        category: '데이트룩',
        tone: '가을웜톤',
        bodyType: '스트레이트',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
        desc: '가을 웜톤을 위한 카멜 니트 & A라인 플리츠 스커트 매칭. 허리선 똑 떨어지는 정핏 니트라 상체 부해 보이지 않아서 대만족!',
        items: [
          { brand: 'MASSIMO DUTTI', title: '100% 캐시미어 크루넥 니트', price: '219,000' },
          { brand: 'MANGO', title: '플리츠 미디 스커트', price: '79,000' }
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
        specs: '161cm · 46kg · 봄웜톤',
        category: '출근룩',
        tone: '봄웜톤',
        bodyType: '웨이브체형',
        image: 'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?auto=format&fit=crop&w=800&q=80',
        desc: '키작녀 웨이브 체형의 크롭 자켓 활용법! 상의를 짧게 입고 목걸이로 시선을 위로 끌어올리면 비율이 확 살아나요 ✨',
        items: [
          { brand: '스파오', title: '클래식 트위드 크롭 자켓', price: '69,900' },
          { brand: '골든듀', title: '18K 옐로우골드 쁘띠 네크리스', price: '380,000' }
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
        specs: '165cm · 51kg · 여름쿨톤',
        category: '주얼리포인트',
        tone: '여름쿨톤',
        bodyType: '웨이브체형',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
        desc: '단추 두 개 푼 린넨 셔츠에 실버925 드롭 이어링으로 완성한 주말 브런치룩. 쇄골 드러내니까 목선이 훨씬 시원해 보여요.',
        items: [
          { brand: '아르켓', title: '릴렉스드 리넨 셔츠', price: '89,000' },
          { brand: '스톤헨지', title: '실버925 드롭 이어링', price: '128,000' }
        ],
        likes: 180,
        isLiked: false,
        scraps: 110,
        isScrapped: false,
        comments: [
          { author: '현주', text: '이어링 정보 여쭤봐도 될까요? 너무 청순해요!' }
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
        body: '파인 울 보트넥 니트 30% 세일 들어갔어요! 제 장바구니에 담아둔 거 알림 떠서 바로 샀습니다 ㅎㅎ 품절 빠르니 얼른 가보세요.',
        author: '쇼퍼홀릭',
        likes: 41,
        commentsCount: 13,
        time: '5시간 전'
      }
    ],
    userProfile: {
      gender: 'female', // 'female' | 'male'
      ageGroup: '30s',  // '20s' | '30s' | '40s'
      height: 164,
      weight: 49
    },
    currentPersona: 'summer_cool_wave',
    femalePersonas: {
      summer_cool_wave: {
        key: 'summer_cool_wave',
        toneName: '여름 쿨 뮤트',
        bodyName: '웨이브 골격',
        badge: 'AI PERSONAL REPORT',
        title: '여성 고객님을 위한 여름 쿨 뮤트 & 웨이브 체형 솔루션',
        desc: '노란기를 뺀 부드러운 라벤더·스카이블루와 하이웨이스트 A라인 실루엣이 결점을 가리고 장점을 극대화합니다.',
        skinRgb: 'RGB(232, 209, 197)',
        skinLab: 'Lab(85, 8, 8)',
        skinToneClass: 'Cool Mute (쿨톤)',
        swatchBg: '#e8d1c5',
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
        badge: 'SPRING WARM VIP REPORT',
        title: '여성 고객님을 위한 봄 웜 브라이트 & 스트레이트 체형 솔루션',
        desc: '생기 넘치는 코랄 핑크와 피치, 군더더기 없는 정핏 브이넥과 싱글 자켓이 볼륨감 있는 상체를 날씬하게 정돈합니다.',
        skinRgb: 'RGB(246, 218, 192)',
        skinLab: 'Lab(88, 14, 22)',
        skinToneClass: 'Warm Bright (웜톤)',
        swatchBg: '#f6dac0',
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
        badge: 'AUTUMN DEEP VIP REPORT',
        title: '여성 고객님을 위한 가을 웜 딥 & 내추럴 체형 솔루션',
        desc: '깊이감 있는 카멜 베이지와 올리브 카키, 골격미를 시크하게 살려주는 오버사이즈 롱코트와 와이드 치노 팬츠의 조합입니다.',
        skinRgb: 'RGB(212, 172, 142)',
        skinLab: 'Lab(72, 16, 26)',
        skinToneClass: 'Warm Deep (웜톤)',
        swatchBg: '#d4ac8e',
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
        badge: 'WINTER VIVID VIP REPORT',
        title: '여성 고객님을 위한 겨울 쿨 딥 & 스트레이트 체형 솔루션',
        desc: '강렬한 젯 블랙과 퓨어 화이트의 선명한 대비감, 칼각으로 떨어지는 테일러드 핏이 도회적인 분위기를 극대화합니다.',
        skinRgb: 'RGB(222, 224, 232)',
        skinLab: 'Lab(78, 4, -9)',
        skinToneClass: 'Cool Vivid (쿨톤)',
        swatchBg: '#dee0e8',
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
        badge: 'MEN COOL MINIMAL REPORT',
        title: '남성 고객님을 위한 여름 쿨 뮤트 & 슬림 테이퍼드 솔루션',
        desc: '도시적인 차콜과 쿨네이비, 쇄골을 단정하게 감싸는 크루넥과 슬림 테이퍼드 슬랙스가 깔끔하고 지적인 무드를 연출합니다.',
        skinRgb: 'RGB(226, 220, 215)',
        skinLab: 'Lab(82, 4, 2)',
        skinToneClass: 'Cool Mute (남성 쿨톤)',
        swatchBg: '#e2dcd7',
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
        badge: 'MEN SPRING CASUAL REPORT',
        title: '남성 고객님을 위한 봄 웜 브라이트 & 테일러드 치노 솔루션',
        desc: '생동감 있는 오트밀과 피치 베이지, 어깨 각을 샤프하게 살려주는 테일러드 자켓과 크림 치노 팬츠가 활력과 호감을 줍니다.',
        skinRgb: 'RGB(242, 214, 186)',
        skinLab: 'Lab(85, 12, 18)',
        skinToneClass: 'Warm Bright (남성 웜톤)',
        swatchBg: '#f2d6ba',
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
        badge: 'MEN AUTUMN GENTLE REPORT',
        title: '남성 고객님을 위한 가을 웜 딥 & 오버 발마칸 코트 솔루션',
        desc: '깊이감 넘치는 카멜과 올리브 카키, 넓은 어깨 프레임을 남성답게 살려주는 롱 발마칸 코트와 와이드 치노의 멋스러운 앙상블입니다.',
        skinRgb: 'RGB(208, 168, 138)',
        skinLab: 'Lab(70, 14, 24)',
        skinToneClass: 'Warm Deep (남성 웜톤)',
        swatchBg: '#d0a88a',
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
        badge: 'MEN WINTER LUXURY REPORT',
        title: '남성 고객님을 위한 겨울 쿨 딥 & 솔리드 옴므 블랙 수트 솔루션',
        desc: '차갑고 선명한 젯 블랙과 스노우 화이트의 하이 콘트라스트, 칼각 테일러드 핏이 도시적인 럭셔리 무드를 완성합니다.',
        skinRgb: 'RGB(218, 222, 230)',
        skinLab: 'Lab(75, 2, -8)',
        skinToneClass: 'Cool Vivid (남성 쿨톤)',
        swatchBg: '#dadee6',
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
  // 3. OOTD 패션 피드 렌더링 (오늘의집 인테리어 자랑 스타일)
  // =========================================================================
  const renderFeed = () => {
    const feedGrid = document.getElementById('feed-grid');
    if (!feedGrid) return;
    feedGrid.innerHTML = '';

    const filtered = state.posts.filter(post => {
      if (state.feedFilter === 'all') return true;
      return post.category === state.feedFilter || 
             post.tone.includes(state.feedFilter) || 
             post.bodyType.includes(state.feedFilter);
    });

    filtered.forEach(post => {
      const card = document.createElement('div');
      card.className = 'feed-card';
      card.innerHTML = `
        <div class="feed-img-box" onclick="openOotdDetail('${post.id}')">
          <img src="${post.image}" alt="${post.desc}" loading="lazy">
          <span class="card-tag-badge">${post.category}</span>
          
          <!-- 오늘의집 스타일 착장 태그 핀 -->
          <div class="item-tag-pin pin-1" onclick="event.stopPropagation();">
            <span class="pin-dot"></span>
            <div class="pin-popover">
              <span class="pin-brand">${post.items[0]?.brand || 'BRAND'}</span>
              <strong class="pin-title">${post.items[0]?.title || '아이템'}</strong>
              <span class="pin-price">₩ ${post.items[0]?.price || '0'}</span>
            </div>
          </div>
          ${post.items[1] ? `
            <div class="item-tag-pin pin-2" onclick="event.stopPropagation();">
              <span class="pin-dot"></span>
              <div class="pin-popover">
                <span class="pin-brand">${post.items[1].brand}</span>
                <strong class="pin-title">${post.items[1].title}</strong>
                <span class="pin-price">₩ ${post.items[1].price}</span>
              </div>
            </div>
          ` : ''}

          <button class="card-scrap-btn ${post.isScrapped ? 'scrapped' : ''}" onclick="event.stopPropagation(); toggleCardScrap('${post.id}', this)" title="스크랩">
            <i data-lucide="bookmark"></i>
          </button>
        </div>

        <div class="feed-card-body" onclick="openOotdDetail('${post.id}')">
          <div class="feed-user-meta">
            <img src="${post.avatar}" alt="${post.author}" class="feed-user-avatar">
            <span class="feed-user-name">${post.author}</span>
            <span class="feed-user-specs">• ${post.specs}</span>
          </div>
          <p class="feed-card-desc">${post.desc}</p>
          <div class="feed-item-tags-snippet">
            🏷️ ${post.items.map(i => `${i.brand} ${i.title}`).join(' / ')}
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
    state.feedFilter = filterKey;
    document.querySelectorAll('.filter-chip').forEach(btn => btn.classList.remove('active'));
    if (el) el.classList.add('active');
    renderFeed();
  };

  window.filterByTone = (tone) => {
    state.feedFilter = tone;
    document.querySelectorAll('.filter-chip').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === tone);
    });
    renderFeed();
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
    document.getElementById('detail-author-specs').textContent = post.specs;
    document.getElementById('detail-desc').textContent = post.desc;

    // 착장 아이템 목록
    const itemsListEl = document.getElementById('detail-items-list');
    itemsListEl.innerHTML = post.items.map(item => `
      <div style="font-size:12.5px; padding:4px 0;">
        <span style="color:var(--primary); font-weight:700;">[${item.brand}]</span> 
        <strong>${item.title}</strong> - ₩${item.price}
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
        <strong>${c.author}</strong> <span>${c.text}</span>
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

  window.submitNewOotd = () => {
    const imgUrl = document.getElementById('post-img-url').value.trim();
    const bodySpec = document.getElementById('post-body-spec').value.trim();
    const toneSpec = document.getElementById('post-tone-spec').value.trim();
    const tagItem = document.getElementById('post-tag-item').value.trim();
    const content = document.getElementById('post-content').value.trim();

    if (!imgUrl || !content) {
      alert('사진과 코디 코멘트를 입력해주세요!');
      return;
    }

    const newPost = {
      id: `post-${Date.now()}`,
      author: state.currentUser.nickname,
      avatar: state.currentUser.avatar,
      specs: `${bodySpec} · ${toneSpec}`,
      category: '출근룩',
      tone: toneSpec.includes('쿨') ? '여름쿨톤' : '봄웜톤',
      bodyType: toneSpec.includes('웨이브') ? '웨이브체형' : '스트레이트',
      image: imgUrl,
      desc: content,
      items: [
        { brand: '착장 브랜드', title: tagItem || '자라 크롭 니트', price: '49,000' }
      ],
      likes: 1,
      isLiked: false,
      scraps: 0,
      isScrapped: false,
      comments: []
    };

    // 피드 최상단 추가
    state.posts.unshift(newPost);
    closeModal('upload-modal');
    renderFeed();
    showToast('sale', '🎉 코디 자랑 완료!', '회원님의 OOTD가 오늘의 패션 피드에 등록되었습니다.');
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
        showToast('info', '게시글 열람', `[${p.category}] ${p.title}`);
      };
      card.innerHTML = `
        <span class="comm-cat-badge">${p.category}</span>
        <h4 class="comm-post-title">${p.title}</h4>
        <p class="comm-post-body">${p.body}</p>
        <div class="comm-post-footer">
          <div class="comm-author-box">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" class="comm-author-avatar" alt="작성자">
            <span>${p.author}</span> • <span>${p.time}</span>
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
  // 7. AI 퍼스널 카운슬링 로직 (3분 음성/대화 진단)
  // =========================================================================
  const aiSteps = [
    {
      msg: `반갑습니다! OOTD 오늘의 코디 수석 스타일 AI 릴리예요 😊<br>
            사진 촬영이 부담스러우셔도 괜찮아요. <strong>일상의 착용 습관과 피부 반응 4가지</strong>만 질문드릴게요!<br><br>
            첫 번째입니다. <strong>거울을 보실 때 골드(노란 금) 목걸이가 화사하신가요, 아니면 실버/화이트골드를 차야 피부가 맑고 시원해 보이나요?</strong>`,
      options: [
        { label: '✨ 은이나 백금이 훨씬 깨끗해 보여요 (실버)', val: 'cool' },
        { label: '🌟 노란 골드가 피부에 따뜻하게 붙어요 (골드)', val: 'warm' },
        { label: '🤔 둘 다 무난하고 로즈골드를 주로 껴요', val: 'neutral' }
      ]
    },
    {
      msg: `피부의 언더톤(쿨/웜) 윤곽이 잡히고 있습니다!<br>
            두 번째 질문이에요. <strong>여름철 햇볕에 피부가 탔을 때 주로 어떻게 반응하나요?</strong>`,
      options: [
        { label: '☀️ 붉게 익고 따갑다가 벗겨져요 (쿨톤)', val: 'cool' },
        { label: '🏖️ 붉은 기 없이 곧바로 까맣게 타요 (웜톤)', val: 'warm' }
      ]
    },
    {
      msg: `피부톤은 <strong>여름 쿨 뮤트</strong>로 확정되었습니다!<br>
            이제 <strong>체형 골격 분석</strong>입니다. 체중이 늘었을 때 주로 <strong>어느 부위에 먼저 살이 붙나요?</strong>`,
      options: [
        { label: '🍐 엉덩이, 허벅지, 아랫배 등 하체 중심 (웨이브형)', val: 'wave' },
        { label: '🍎 목덜미, 가슴, 윗배 등 상체 중심 (스트레이트형)', val: 'straight' },
        { label: '🦴 몸 전체에 고루 붙거나 뼈마디가 도드라짐 (내추럴형)', val: 'natural' }
      ]
    },
    {
      msg: `마지막 질문입니다! <strong>평소 셔츠를 입으실 때 윗단추를 1~2개 풀어 쇄골을 은은하게 보여주는 게 목이 길어 보이나요?</strong>`,
      options: [
        { label: '🪞 단추를 풀어 쇄골을 보여줘야 시원하고 길어 보여요', val: 'open' },
        { label: '👔 단추를 끝까지 단정하게 채우는 게 더 어울려요', val: 'closed' }
      ]
    }
  ];

  const renderAiChatStep = () => {
    const chatMsgArea = document.getElementById('ai-chat-messages');
    const chipsBox = document.getElementById('ai-quick-chips');
    if (!chatMsgArea || !chipsBox) return;

    if (state.aiStep >= aiSteps.length) {
      finishAiDiagnosis();
      return;
    }

    const step = aiSteps[state.aiStep];

    // AI 메시지 추가
    const aiRow = document.createElement('div');
    aiRow.className = 'chat-bubble-row ai';
    aiRow.innerHTML = `
      <div class="bubble-avatar">AI</div>
      <div class="bubble-content">${step.msg}</div>
    `;
    chatMsgArea.appendChild(aiRow);
    chatMsgArea.scrollTop = chatMsgArea.scrollHeight;

    // 칩 생성
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
    const chatMsgArea = document.getElementById('ai-chat-messages');
    const userRow = document.createElement('div');
    userRow.className = 'chat-bubble-row user';
    userRow.innerHTML = `<div class="bubble-content">${text}</div>`;
    chatMsgArea.appendChild(userRow);
    chatMsgArea.scrollTop = chatMsgArea.scrollHeight;

    document.getElementById('ai-quick-chips').innerHTML = '';

    // 실시간 아바타 모핑 시각화
    updateMorphingAvatar(val);

    state.aiStep++;
    setTimeout(renderAiChatStep, 500);
  };

  const updateMorphingAvatar = (val) => {
    const skinStop1 = document.getElementById('skin-stop-1');
    const skinStop2 = document.getElementById('skin-stop-2');
    const liveToneVal = document.getElementById('live-tone-val');
    const liveShapeVal = document.getElementById('live-shape-val');
    const morphTorso = document.getElementById('morph-torso');
    const morphPelvis = document.getElementById('morph-pelvis');

    if (val === 'cool') {
      skinStop1?.setAttribute('stop-color', '#fff0ea');
      skinStop2?.setAttribute('stop-color', '#eed2cb');
      if (liveToneVal) liveToneVal.textContent = '여름 쿨 뮤트 (청량)';
    } else if (val === 'warm') {
      skinStop1?.setAttribute('stop-color', '#fef3c7');
      skinStop2?.setAttribute('stop-color', '#fde68a');
      if (liveToneVal) liveToneVal.textContent = '가을 웜 (온화)';
    } else if (val === 'wave') {
      morphTorso?.setAttribute('d', 'M68,102 Q100,99 132,102 L124,170 Q100,174 76,170 Z');
      morphPelvis?.setAttribute('d', 'M76,170 Q100,174 124,170 L142,215 Q100,222 58,215 Z');
      if (liveShapeVal) liveShapeVal.textContent = '웨이브 골격 (하체 곡선)';
    } else if (val === 'straight') {
      morphTorso?.setAttribute('d', 'M58,100 Q100,96 142,100 L132,165 Q100,167 68,165 Z');
      morphPelvis?.setAttribute('d', 'M68,165 Q100,167 132,165 L132,210 Q100,214 68,210 Z');
      if (liveShapeVal) liveShapeVal.textContent = '스트레이트 (상체 볼륨)';
    }
  };

  const finishAiDiagnosis = () => {
    const chatMsgArea = document.getElementById('ai-chat-messages');
    const aiRow = document.createElement('div');
    aiRow.className = 'chat-bubble-row ai';
    aiRow.innerHTML = `
      <div class="bubble-avatar">AI</div>
      <div class="bubble-content">
        🎉 <strong>모든 진단이 완료되었습니다!</strong><br>
        고객님의 체형(웨이브)과 퍼스널컬러(여름 쿨 뮤트)에 맞춘 <strong>상세 솔루션 리포트와 머리부터 발끝까지의 풀착장 쇼룸</strong>이 아래에 펼쳐졌습니다.
      </div>
    `;
    chatMsgArea.appendChild(aiRow);

    const resultArea = document.getElementById('ai-result-area');
    if (resultArea) {
      resultArea.style.display = 'block';
      renderCuratedShowroom();
      resultArea.scrollIntoView({ behavior: 'smooth' });
    }
    showToast('sale', 'AI 진단 완료', '고객님을 위한 여름 쿨톤 & 웨이브 전용 쇼룸이 열렸습니다.');
    
    // 진단 결과 모달 즉시 팝업 오픈
    setTimeout(() => {
      openDiagnosisResultModal();
    }, 500);
  };

  window.resetAiChat = () => {
    state.aiStep = 0;
    const chatMsgArea = document.getElementById('ai-chat-messages');
    if (chatMsgArea) chatMsgArea.innerHTML = '';
    renderAiChatStep();
  };

  document.getElementById('ai-send-btn')?.addEventListener('click', () => {
    const input = document.getElementById('ai-user-input');
    if (input.value.trim()) {
      handleAiUserAnswer(input.value.trim(), 'cool');
      input.value = '';
    }
  });

  // 음성인식 (바이브 보이스) 연동
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
      const text = e.results[0][0].transcript;
      handleAiUserAnswer(text, text.includes('골드') ? 'warm' : 'cool');
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

  window.simulatePhotoPick = (type) => {
    const el = document.getElementById(`${type}-photo-status`);
    if (el) el.innerHTML = '<span style="color:#03c75a;">✔ 사진 등록 완료</span>';
    const scanBtn = document.getElementById('run-photo-scan-btn');
    if (scanBtn) scanBtn.disabled = false;
    showToast('info', '사진 등록 완료', `${type === 'face' ? '얼굴' : '전신'} 사진이 등록되었습니다. 'AI 정밀 비전 스캔 실행' 버튼을 누르시면 진단서가 생성됩니다.`);
  };

  window.executePhotoScan = () => {
    const scanBtn = document.getElementById('run-photo-scan-btn');
    if (scanBtn) {
      scanBtn.textContent = '⚡ 비전 딥스캔 분석 중... (조도 보정 및 랜드마크 추출)';
      scanBtn.disabled = true;
    }
    showToast('info', 'AI 딥스캔 시작', '얼굴 랜드마크 추출 및 피부 Lab 색소 분석을 진행하고 있습니다...');

    setTimeout(() => {
      if (scanBtn) {
        scanBtn.textContent = '✔ 분석 완료!';
        scanBtn.disabled = false;
      }
      
      // 랜덤하게 다른 페르소나를 매칭하여 동적 분석 시연 (봄 웜 또는 가을 웜 또는 겨울 쿨)
      const personaKeys = ['spring_warm_straight', 'summer_cool_wave', 'autumn_warm_natural', 'winter_cool_straight'];
      const nextKey = personaKeys[Math.floor(Math.random() * personaKeys.length)];
      changeDiagnosisPersona(nextKey);

      showToast('sale', '🎉 비전 분석 완료!', `'${state.personas[nextKey].toneName} & ${state.personas[nextKey].bodyName}' 진단서가 실시간 갱신되었습니다.`);
      openDiagnosisResultModal(state.lastCapturedPhotoUrl);
    }, 1200);
  };

  // =========================================================================
  // 7-0. 신상 정보(성별/연령대/실측스펙) 제어 엔진
  // =========================================================================
  window.setUserGender = (gender) => {
    state.userProfile.gender = gender;
    
    // 버튼 UI 클래스 동기화 (male/female)
    document.querySelectorAll('.gender-btn.male, .modal-sync-male').forEach(btn => {
      btn.classList.toggle('active', gender === 'male');
    });
    document.querySelectorAll('.gender-btn.female, .modal-sync-female').forEach(btn => {
      btn.classList.toggle('active', gender === 'female');
    });

    // 기본 체형 스펙 동기화 (남성: 177cm/72kg, 여성: 164cm/49kg)
    const hInput = document.getElementById('input-user-height');
    const wInput = document.getElementById('input-user-weight');
    if (gender === 'male') {
      if (hInput) hInput.value = '177';
      if (wInput) wInput.value = '72';
      state.userProfile.height = 177;
      state.userProfile.weight = 72;
    } else {
      if (hInput) hInput.value = '164';
      if (wInput) wInput.value = '49';
      state.userProfile.height = 164;
      state.userProfile.weight = 49;
    }

    updateProfileNoticeText();
    changeDiagnosisPersona(state.currentPersona);
    showToast('info', '성별 타겟팅 변경', `${gender === 'male' ? '남성 (MEN)' : '여성 (WOMEN)'} 전용 핏 및 브랜드 큐레이션으로 전환되었습니다.`);
  };

  window.setUserAgeGroup = (age) => {
    state.userProfile.ageGroup = age;
    
    // 연령대 칩 UI 동기화
    ['20s', '30s', '40s'].forEach(a => {
      document.querySelectorAll(`.age-chip-btn[data-age="${a}"], .modal-sync-age-${a}`).forEach(btn => {
        btn.classList.toggle('active', age === a);
      });
    });

    updateProfileNoticeText();
    changeDiagnosisPersona(state.currentPersona);
    showToast('info', '연령대 타겟팅 변경', `${age === '20s' ? '20대 트렌디' : age === '30s' ? '30대 컨템포러리 오피스' : '40대+ 클래식 프리미엄'} 스타일로 재편성되었습니다.`);
  };

  window.updateUserSpecs = () => {
    const hInput = document.getElementById('input-user-height');
    const wInput = document.getElementById('input-user-weight');
    if (hInput) state.userProfile.height = parseInt(hInput.value) || 165;
    if (wInput) state.userProfile.weight = parseInt(wInput.value) || 55;
    updateProfileNoticeText();
    renderCuratedShowroom();
    renderModalCuratedItems();
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

    notice.innerHTML = `💡 <strong>${isMale ? '남성' : '여성'} ${age === '20s' ? '20대' : age === '30s' ? '30대' : '40대+'}</strong> (${state.userProfile.height}cm / ${state.userProfile.weight}kg) 맞춤: <strong>${styleText}</strong> (${brandText}) 중심으로 큐레이션됩니다.`;
  };

  // =========================================================================
  // 7-1. 동적 페르소나 전환 엔진 (Tone & Body Type Dynamic Engine)
  // =========================================================================
  window.changeDiagnosisPersona = (personaKey, customSkinData) => {
    if (!state.personas[personaKey]) return;
    state.currentPersona = personaKey;
    const p = state.personas[personaKey];
    const isMale = state.userProfile.gender === 'male';
    const ageLabel = state.userProfile.ageGroup === '20s' ? '20대' : state.userProfile.ageGroup === '30s' ? '30대' : '40대+';
    const profilePrefix = `${ageLabel} ${isMale ? '남성' : '여성'}`;

    // 1. 활성 칩 버튼 상태 갱신
    document.querySelectorAll('.persona-chip').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.persona === personaKey);
    });

    // 2. 페이지 내부 결과 영역 업데이트 (#ai-result-area)
    const pBadge = document.getElementById('page-result-badge');
    const pTitle = document.getElementById('page-result-title');
    const pDesc = document.getElementById('page-result-desc');
    const pSwatch = document.getElementById('page-swatch-box');
    const pRgb = document.getElementById('page-metrics-rgb');
    const pLab = document.getElementById('page-metrics-lab');
    const pTone = document.getElementById('page-metrics-tone');

    if (pBadge) pBadge.textContent = `${profilePrefix.toUpperCase()} · ${p.badge}`;
    if (pTitle) pTitle.innerHTML = `<span style="color:var(--primary); font-size:14px; display:block; margin-bottom:4px;">[${profilePrefix} 전용 큐레이션]</span>고객님을 위한 <span class="highlight-blue">${p.toneName} & ${p.bodyName}</span> 솔루션`;
    if (pDesc) pDesc.textContent = p.desc;
    if (pSwatch) pSwatch.style.background = customSkinData?.swatchBg || p.swatchBg;
    if (pRgb) pRgb.textContent = customSkinData?.rgbStr || p.skinRgb;
    if (pLab) pLab.textContent = customSkinData?.labStr || p.skinLab;
    if (pTone) pTone.textContent = p.skinToneClass;

    const pCard1Title = document.getElementById('page-card1-title');
    const pCard1Desc = document.getElementById('page-card1-desc');
    const pPalette = document.getElementById('page-palette-dots');
    if (pCard1Title) pCard1Title.textContent = `퍼스널 컬러: ${p.toneName}`;
    if (pCard1Desc) pCard1Desc.textContent = p.desc;
    if (pPalette) {
      pPalette.innerHTML = p.paletteDots.map(dot => `
        <span style="background: ${dot.color};" title="${dot.name}"></span>
      `).join('');
    }

    const pCard2Title = document.getElementById('page-card2-title');
    const pCard2Desc = document.getElementById('page-card2-desc');
    const pCard2Tags = document.getElementById('page-card2-tags');
    if (pCard2Title) pCard2Title.textContent = `체형 골격: ${p.bodyName}`;
    if (pCard2Desc) pCard2Desc.textContent = p.bodyDesc;
    if (pCard2Tags) {
      pCard2Tags.innerHTML = p.bodyTags.map(tag => `<span>${tag}</span>`).join(' ');
    }

    const pCard3Title = document.getElementById('page-card3-title');
    const pCard3Desc = document.getElementById('page-card3-desc');
    const pCard3Tags = document.getElementById('page-card3-tags');
    if (pCard3Title) pCard3Title.textContent = `주얼리 & 넥라인: ${p.jewelTags[0]}`;
    if (pCard3Desc) pCard3Desc.textContent = p.jewelDesc;
    if (pCard3Tags) {
      pCard3Tags.innerHTML = p.jewelTags.map(tag => `<span>${tag}</span>`).join(' ');
    }

    // 3. 팝업 모달 내부 영역 업데이트 (#diagnosis-result-modal)
    const mTitle = document.getElementById('modal-result-title');
    const mDesc = document.getElementById('modal-result-desc');
    const mSwatch = document.getElementById('modal-swatch-box');
    const mRgb = document.getElementById('modal-metrics-rgb');
    const mLab = document.getElementById('modal-metrics-lab');
    const mTags = document.getElementById('modal-tag-pills');

    if (mTitle) mTitle.innerHTML = `<span style="color:var(--primary); font-size:13px; display:block;">[${profilePrefix} 맞춤 분석]</span>진단 결과: <strong style="color:var(--primary);">${p.toneName}</strong> & <strong style="color:var(--primary);">${p.bodyName}</strong>`;
    if (mDesc) mDesc.textContent = p.desc;
    if (mSwatch) mSwatch.style.background = customSkinData?.swatchBg || p.swatchBg;
    if (mRgb) mRgb.textContent = customSkinData?.rgbStr || p.skinRgb;
    if (mLab) mLab.textContent = customSkinData?.labStr || p.skinLab;
    if (mTags) {
      mTags.innerHTML = `
        <span>#${profilePrefix.replace(/\s+/g, '_')}</span>
        <span>#${p.toneName.replace(/\s+/g, '')}</span>
        <span>#${p.bodyName.replace(/\s+/g, '')}</span>
        <span>#${p.bodyTags[0]?.replace('#', '') || '체형맞춤'}</span>
      `;
    }

    const mCard1Title = document.getElementById('modal-card1-title');
    const mCard1Desc = document.getElementById('modal-card1-desc');
    const mPalette = document.getElementById('modal-palette-dots');
    if (mCard1Title) mCard1Title.textContent = `🎨 베스트 컬러 팔레트 (${p.toneName})`;
    if (mCard1Desc) mCard1Desc.textContent = p.desc;
    if (mPalette) {
      mPalette.innerHTML = p.paletteDots.map(dot => `
        <span style="background: ${dot.color};" title="${dot.name}"></span>
      `).join('');
    }

    const mCard2Title = document.getElementById('modal-card2-title');
    const mCard2Desc = document.getElementById('modal-card2-desc');
    const mCard2Tags = document.getElementById('modal-card2-tags');
    if (mCard2Title) mCard2Title.textContent = `👔 체형 보완 핏 공식 (${p.bodyName})`;
    if (mCard2Desc) mCard2Desc.textContent = p.bodyDesc;
    if (mCard2Tags) {
      mCard2Tags.innerHTML = p.bodyTags.map(tag => `<span>${tag}</span>`).join(' ');
    }

    const mCard3Title = document.getElementById('modal-card3-title');
    const mCard3Desc = document.getElementById('modal-card3-desc');
    const mCard3Tags = document.getElementById('modal-card3-tags');
    if (mCard3Title) mCard3Title.textContent = `💎 넥라인 & 주얼리 (${p.jewelTags[0]})`;
    if (mCard3Desc) mCard3Desc.textContent = p.jewelDesc;
    if (mCard3Tags) {
      mCard3Tags.innerHTML = p.jewelTags.map(tag => `<span>${tag}</span>`).join(' ');
    }

    // 4. 실시간 아바타 비주얼 모핑 동기화
    updateMorphingAvatar(p.toneName.includes('쿨') ? 'cool' : 'warm');
    updateMorphingAvatar(p.bodyName.includes('웨이브') ? 'wave' : 'straight');

    // 5. 추천 상품 쇼룸 재렌더링
    renderCuratedShowroom();
    renderModalCuratedItems();
    refreshIcons();
  };

  // =========================================================================
  // 7-2. AI 퍼스널 진단 결과서 모달 열기 & 쇼룸 아이템 렌더링
  // =========================================================================
  window.openDiagnosisResultModal = (photoUrl) => {
    const photoEl = document.getElementById('result-user-photo');
    if (photoEl) {
      if (photoUrl) {
        photoEl.src = photoUrl;
      } else if (state.lastCapturedPhotoUrl) {
        photoEl.src = state.lastCapturedPhotoUrl;
      } else {
        photoEl.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
      }
    }

    // 현재 페르소나 데이터 반영
    changeDiagnosisPersona(state.currentPersona);

    // 페이지 내부 결과 쇼룸도 함께 표시
    const resultArea = document.getElementById('ai-result-area');
    if (resultArea) {
      resultArea.style.display = 'block';
    }

    openModal('diagnosis-result-modal');
    refreshIcons();
  };

  const renderModalCuratedItems = () => {
    const grid = document.getElementById('modal-curated-items-grid');
    if (!grid) return;
    grid.innerHTML = '';

    state.curatedItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'curated-card';
      card.innerHTML = `
        <div class="curated-img-wrap">
          <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=500&q=80';">
          ${item.stock <= 2 ? `<span class="curated-stock-badge">🚨 잔여 ${item.stock}개</span>` : ''}
          <span style="position:absolute; bottom:8px; left:8px; background:rgba(0,0,0,0.65); color:#fff; font-size:10px; padding:2px 6px; border-radius:3px;">${item.mall || '제휴몰'}</span>
        </div>
        <div class="curated-body">
          <span class="curated-brand">${item.brand}</span>
          <h5 class="curated-title">${item.title}</h5>
          <div class="curated-fit">
            ${item.fit}<br>
            <strong>${item.size}</strong>
          </div>
          <div class="curated-footer">
            <span class="curated-price">₩ ${item.price.toLocaleString()}</span>
            <button class="single-add-btn" onclick="addToCart('${item.id}')">+ 담기</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
    refreshIcons();
  };

  // =========================================================================
  // 7-3. 쇼핑몰 URL 직접 분석기 시뮬레이션
  // =========================================================================
  window.setSampleUrl = (mall) => {
    const input = document.getElementById('custom-mall-url');
    if (!input) return;
    if (mall === 'musinsa') {
      input.value = 'https://www.musinsa.com/app/goods/2849102 (무신사 스탠다드 퓨어 캐시미어 브이넥 니트)';
    } else if (mall === '29cm') {
      input.value = 'https://www.29cm.co.kr/product/1849204 (던스트 테일러드 2버튼 싱글 울 자켓)';
    } else if (mall === 'zara') {
      input.value = 'https://www.zara.com/kr/ko/fluid-pants-p0790142.html (ZARA 플루이드 와이드 하이라이즈 팬츠)';
    }
    analyzeCustomMallUrl();
  };

  window.analyzeCustomMallUrl = () => {
    const input = document.getElementById('custom-mall-url');
    const resultBox = document.getElementById('url-analysis-result');
    if (!input || !resultBox) return;

    const url = input.value.trim();
    if (!url) {
      alert('쇼핑몰 상품 링크(URL)를 입력해주세요!');
      return;
    }

    resultBox.style.display = 'flex';
    resultBox.innerHTML = `
      <div style="text-align:center; width:100%; padding:14px; color:var(--primary); font-size:13px; font-weight:700;">
        ⚡ 크롤러가 쇼핑몰 상세페이지 스펙 & 모델 착용 이미지를 수집하여 비전 AI로 분석하고 있습니다...
      </div>
    `;

    setTimeout(() => {
      let title = '파인 게이지 울 보트넥 니트';
      let brand = 'COS';
      let neckline = '보트넥 (가로로 긴 넥라인, 쇄골 노출)';
      let toneFit = '여름 쿨톤 / 겨울 쿨톤 (96% 일치)';
      let bodyFit = '웨이브 체형 최적 (상체 목선 연장 및 시선 분산 효과)';
      let img = 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=300&q=80';
      let price = '135,000원';

      if (url.includes('무신사') || url.includes('musinsa')) {
        title = '퓨어 캐시미어 브이넥 니트';
        brand = '무신사 스탠다드';
        neckline = 'V넥 (깊지 않은 V존, 바스트 부각 방지)';
        toneFit = '봄 웜톤 / 가을 웜톤 (98% 일치)';
        bodyFit = '스트레이트 체형 추천 (상체 볼륨 커버 슬림핏)';
        img = 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=300&q=80';
        price = '89,900원';
      } else if (url.includes('던스트') || url.includes('29cm') || url.includes('자켓')) {
        title = '클래식 테일러드 싱글 2버튼 울 자켓';
        brand = 'DUNST (29CM)';
        neckline = '테일러드 라펠 & 싱글 브레스트';
        toneFit = '웜톤 & 뉴트럴 (95% 일치)';
        bodyFit = '스트레이트 및 내추럴 체형 강력 추천';
        img = 'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?auto=format&fit=crop&w=300&q=80';
        price = '248,000원';
      } else if (url.includes('zara') || url.includes('ZARA') || url.includes('팬츠')) {
        title = '플루이드 플리츠 와이드 슬랙스';
        brand = 'ZARA';
        neckline = '하이라이즈 허리선 (허리 68cm 맞춤)';
        toneFit = '전 톤 무난 (모노톤 차콜/블랙)';
        bodyFit = '웨이브 체형 최적 (골반 및 힙라인 부드러운 커버)';
        img = 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=300&q=80';
        price = '59,900원';
      }

      resultBox.innerHTML = `
        <img src="${img}" alt="분석 상품" class="url-res-img">
        <div class="url-res-info">
          <h5>[${brand}] ${title} <span style="color:var(--primary); font-size:12px; margin-left:8px;">₩ ${price}</span></h5>
          <p><strong>• 넥라인/실루엣:</strong> ${neckline}</p>
          <p><strong>• 퍼스널 컬러 적합도:</strong> <span style="color:var(--accent-green); font-weight:700;">${toneFit}</span></p>
          <p><strong>• 체형 솔루션:</strong> <span style="color:var(--primary); font-weight:700;">${bodyFit}</span></p>
        </div>
      `;
      showToast('sale', '쇼핑몰 상품 분석 완료', `[${brand}] 상품의 체형·컬러 적합도 분석이 완료되었습니다.`);
    }, 800);
  };

  // =========================================================================
  // 8. 맞춤 큐레이션 쇼룸 & 스마트 장바구니
  // =========================================================================
  const renderCuratedShowroom = () => {
    const grid = document.getElementById('curated-items-grid');
    if (!grid) return;
    grid.innerHTML = '';

    state.curatedItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'curated-card';
      card.innerHTML = `
        <div class="curated-img-wrap">
          <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=500&q=80';">
          ${item.stock <= 2 ? `<span class="curated-stock-badge">🚨 잔여 ${item.stock}개</span>` : ''}
          <span style="position:absolute; bottom:8px; left:8px; background:rgba(0,0,0,0.65); color:#fff; font-size:10px; padding:2px 6px; border-radius:3px;">${item.mall || '제휴몰'}</span>
        </div>
        <div class="curated-body">
          <span class="curated-brand">${item.brand}</span>
          <h5 class="curated-title">${item.title}</h5>
          <div class="curated-fit">
            ${item.fit}<br>
            <strong>${item.size}</strong>
          </div>
          <div class="curated-footer">
            <span class="curated-price">₩ ${item.price.toLocaleString()}</span>
            <button class="single-add-btn" onclick="addToCart('${item.id}')">+ 담기</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
    refreshIcons();
  };

  window.addToCart = (itemId) => {
    const item = state.curatedItems.find(i => i.id === itemId);
    if (!item) return;

    if (!state.cart.some(c => c.id === item.id)) {
      state.cart.push(item);
      updateCartBadge();
      showToast('sale', '장바구니 담김', `[${item.brand}] ${item.title}이(가) 추가되었습니다. 24시간 가격할인·품절알림이 켜졌습니다.`);
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
    showToast('sale', '풀착장 5종 담기 완료', '가격 하락 및 품절 임박 24시간 스마트 트래커가 가동되었습니다.');
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
          <p>장바구니가 비어 있습니다.<br>AI 맞춤 쇼룸에서 마음에 드는 상품을 담아보세요.</p>
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

  // 시뮬레이터 테스트
  window.simulatePriceDrop = () => {
    showToast(
      'sale',
      '⚡ [PRICE DROP] 30% 즉시 할인 감지!',
      '담아두신 [COS] 파인 게이지 울 보트넥 니트가 ₩135,000 ➔ ₩94,500으로 인하되었습니다.'
    );
  };

  window.simulateLowStock = () => {
    showToast(
      'stock',
      '🚨 [LOW STOCK] 내 사이즈 품절 임박!',
      '[ZARA] 플루이드 플리츠 와이드 슬랙스 (추천 M) 잔여 수량이 단 1개 남았습니다!'
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
        <div class="user-logged-profile" onclick="showToast('info', '마이 프로필', '${state.currentUser.nickname}님의 개인 스타일 서재')">
          <img src="${state.currentUser.avatar}" alt="프로필" class="user-logged-avatar">
          <span class="user-logged-name">${state.currentUser.nickname}</span>
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
    showToast('info', '로그인 완료', `${state.currentUser.nickname}님 환영합니다!`);
  };

  window.doRegister = () => {
    const nick = document.getElementById('reg-nickname').value || '뉴_패셔니스타';
    const specs = document.getElementById('reg-specs').value || '165cm · 50kg';
    const tone = document.getElementById('reg-tone').value;

    state.currentUser.isLoggedIn = true;
    state.currentUser.nickname = nick;
    state.currentUser.specs = `${specs} · ${tone}`;
    updateAuthUI();
    closeModal('auth-modal');
    showToast('sale', '회원가입 완료', `${nick}님, OOTD 오늘의 코디 가입을 축하드립니다!`);
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
      titleEl.textContent = '얼굴 정면 촬영 (퍼스널컬러 진단용)';
      if (guideShape) {
        guideShape.style.borderRadius = '50%';
        guideShape.style.width = '200px';
        guideShape.style.height = '260px';
      }
      if (guideText) guideText.textContent = '얼굴을 원 안에 맞추고 턱 밑에 A4용지를 대주세요';
    } else if (target === 'body') {
      titleEl.textContent = '전신 실루엣 촬영 (체형 골격 진단용)';
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
    state.lastCapturedPhotoUrl = dataUrl;

    // 실제 캔버스 중심부 피부 픽셀 색상 샘플링 (컴퓨터 비전 색소 분석)
    let r = 232, g = 209, b = 197;
    try {
      const centerX = Math.floor(canvas.width / 2);
      const centerY = Math.floor(canvas.height / 2);
      const pixel = ctx.getImageData(centerX, centerY, 1, 1).data;
      if (pixel && pixel[3] > 0) {
        r = pixel[0];
        g = pixel[1];
        b = pixel[2];
      }
    } catch (e) {
      console.warn('Canvas pixel read error:', e);
    }

    const brightness = (r + g + b) / 3;
    const warmth = (r - b);

    let detectedPersona = 'summer_cool_wave';
    if (warmth > 18) {
      detectedPersona = brightness > 150 ? 'spring_warm_straight' : 'autumn_warm_natural';
    } else {
      detectedPersona = brightness > 140 ? 'summer_cool_wave' : 'winter_cool_straight';
    }

    const skinData = {
      rgbStr: `RGB(${r}, ${g}, ${b})`,
      labStr: `Lab(${Math.round(brightness / 2.55)}, ${Math.round((r - g) * 0.4)}, ${Math.round((g - b) * 0.4)})`,
      swatchBg: `rgb(${r}, ${g}, ${b})`
    };

    if (state.camera.target === 'ootd') {
      document.getElementById('post-img-url').value = dataUrl;
      const previewImg = document.getElementById('post-preview-img');
      if (previewImg) previewImg.src = dataUrl;
      closeCameraViewfinder();
      openModal('upload-modal');
      showToast('sale', '촬영 완료!', '방금 찍은 사진이 코디 자랑에 적용되었습니다. 내용을 작성하고 등록해보세요.');
    } else if (state.camera.target === 'face' || state.camera.target === 'body') {
      const isFace = state.camera.target === 'face';
      const statusEl = document.getElementById(`${state.camera.target}-photo-status`);
      if (statusEl) {
        statusEl.innerHTML = `<span style="color:#03c75a; font-weight:700;">✔ ${isFace ? '얼굴' : '전신'} 촬영 & 딥스캔 완료 (${skinData.rgbStr})</span>`;
      }
      const scanBtn = document.getElementById('run-photo-scan-btn');
      if (scanBtn) scanBtn.disabled = false;

      closeCameraViewfinder();

      // 감지된 페르소나 및 실측 피부색 적용
      changeDiagnosisPersona(detectedPersona, skinData);

      // 즉시 딥스캔 분석 및 결과 팝업 표시
      showToast('info', '⚡ AI 비전 분석 완료', `실제 사진 측정값 [${skinData.rgbStr}] 기준 ➔ '${state.personas[detectedPersona].toneName} & ${state.personas[detectedPersona].bodyName}' 진단`);
      
      setTimeout(() => {
        showToast('sale', '🎉 맞춤 진단서 발급!', `'${state.personas[detectedPersona].toneName}' 전용 쇼핑몰 큐레이션이 열렸습니다.`);
        openDiagnosisResultModal(dataUrl);
      }, 500);
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
      }
    };
    reader.readAsDataURL(file);
  };

  // =========================================================================
  // 12. 초기 구동
  // =========================================================================
  if (window.innerWidth > 768) {
    document.body.classList.add('force-pc-mode');
    document.getElementById('btn-view-pc')?.classList.add('active');
    document.getElementById('btn-view-mobile')?.classList.remove('active');
  }

  renderFeed();
  renderCommunity();
  renderAiChatStep();
  renderCuratedShowroom();
  renderModalCuratedItems();
  updateAuthUI();
  updateCartBadge();
});
