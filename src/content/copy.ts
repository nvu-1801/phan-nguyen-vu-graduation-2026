export const copy = {
  greeting: "Chào bạn, mình là Vũ!",
  hero: "Mình sắp tốt nghiệp rồi. Giữa nhiều điều muốn nói trong ngày ấy, có một lời mời mình muốn gửi đến bạn: đến chung vui với mình nhé. Mình mong sẽ có một tấm hình có cả bạn, và một cuộc trò chuyện không cần vội.",
  campus: "Có những điều chỉ khi sắp bước sang một chặng đường mới, mình mới muốn dừng lại để nhìn lâu hơn. Ngày tốt nghiệp là một dịp như thế — để vui, để biết ơn và để gặp những người mình quý.",
  event: "Nếu sắp xếp được thời gian, bạn ghé chung vui với mình nhé. Mình để thông tin buổi lễ ở đây để bạn tiện lưu lại. Ngày hiện là dự kiến; có giờ chính thức, mình sẽ cập nhật trên thiệp.",
  letter: [
    "Chào bạn, cảm ơn vì đã mở lời mời này. Mình đã nghĩ về ngày tốt nghiệp và nhận ra: điều mình mong đợi không chỉ là khoảnh khắc nhận bằng, mà còn là được gặp những người mình quý trong ngày hôm ấy.",
    "Vậy nên, mình muốn mời bạn đến chung vui. Không cần một món quà hay một lời chúc thật trau chuốt đâu. Bạn ghé qua, gọi mình một tiếng, rồi tụi mình chụp cùng nhau một tấm hình — với mình, như thế đã rất vui rồi.",
    "Nếu có thời gian, mình mong tụi mình sẽ đứng lại nói chuyện một chút. Kể nhau nghe dạo này thế nào, cười với nhau vài câu, để sau này nhìn lại tấm ảnh, mình còn nhớ cả cuộc gặp hôm ấy.",
    "Còn nếu bạn ở xa hoặc bận việc, đừng ngại nhé. Bạn có thể để lại vài dòng ở bên dưới. Dài hay ngắn đều được, chỉ cần là điều bạn muốn nói. Mình sẽ đọc và trân trọng từng lời nhắn.",
    "Cảm ơn bạn vì đã dành thời gian cho mình. Dù gặp nhau ở buổi lễ hay qua một lời chúc từ xa, mình vẫn rất vui vì có bạn cùng chia sẻ cột mốc này.",
  ],
  rsvp: "Bạn cho mình biết có thể đến không nhé. Nếu chưa chắc lịch, bạn cứ liên hệ trực tiếp với mình. Không đến được cũng không sao — lời nhắn ở đây chỉ gửi riêng cho Vũ.",
  response: "Một lời hẹn đến chung vui, một lời nhắn để giữ lại. Bạn chọn cách nào cũng được — mình đều trân trọng.",
  wishes: "Bạn có thể chọn một gợi ý bên dưới hoặc viết bằng lời của riêng mình. Lời nhắn mặc định là riêng tư; nếu muốn chia sẻ với mọi người, bạn có thể chủ động đồng ý công khai. Vũ sẽ duyệt trước khi lời chúc hiện lên trang.",
  photo: "Hai tấm hình này vẫn còn thiếu một điều: một tấm có bạn đứng cạnh. Nếu hôm ấy gặp nhau, nhớ gọi mình lại chụp hình nhé. Mình muốn giữ cả niềm vui của cuộc gặp trong tấm ảnh ấy.",
  coffee: "Bạn đến chung vui hoặc gửi một lời nhắn thôi đã là một món quà rồi. Nếu vẫn muốn mời mình một ly cà phê cho chặng đường mới, mình xin nhận và cảm ơn bạn thật nhiều. Hoàn toàn tùy bạn nhé.",
  closing: "Cảm ơn bạn đã đọc đến đây. Mình mong ngày ấy sẽ có dịp gặp bạn, nhưng dù bạn ở đâu, mình cũng chúc bạn có những ngày bình an, làm điều mình yêu thích và luôn có người để chia sẻ niềm vui.",
} as const;

export const wishIdeas = [
  {
    label: "Chân thành",
    message: "Chúc mừng Vũ đã đi hết một chặng đường thật đẹp! Mình mong những ngày sau sẽ mang đến cho bạn những công việc khiến bạn thấy hào hứng, những người đồng nghiệp tử tế và đủ thời gian cho những điều mình yêu. Cứ giữ sự chân thành như bây giờ, rồi mọi thứ sẽ dần về đúng chỗ.",
  },
  {
    label: "Ấm áp",
    message: "Hôm nay bạn là tân cử nhân rồi đó! Mình chúc Vũ có những buổi sáng không phải vội, những bữa cơm ngon và một vòng tay để trở về sau ngày dài. Thành công lớn lao thì tốt, nhưng mình mong bạn luôn thấy đủ đầy với những điều nhỏ bé.",
  },
  {
    label: "Nhẹ nhàng",
    message: "Chúc Vũ bước vào chặng mới với một trái tim bình tĩnh. Nếu có lúc mọi thứ rối bời, mong bạn nhớ rằng mình đã từng hoàn thành những điều khó hơn thế. Đi chậm một chút cũng được, miễn là vẫn là chính mình.",
  },
  {
    label: "Vui một chút",
    message: "Chúc mừng tân cử nhân Vũ! Từ hôm nay, bạn chính thức có quyền ngủ nướng mà không thấy áy náy, có quyền thử những việc mình chưa từng làm và có quyền rủ bạn bè đi cà phê ăn mừng. Mong tài khoản ngân hàng cũng vui theo tấm bằng này!",
  },
  {
    label: "Gửi từ xa",
    message: "Hôm ấy mình không đến được, nhưng vẫn muốn chen vào một chút để nói: chúc mừng Vũ! Mình biết ngày này không đến một cách dễ dàng, nên càng mong bạn được vui trọn vẹn. Khi nào có dịp gần nhau, nhớ kể mình nghe về ngày tốt nghiệp của bạn nhé.",
  },
  {
    label: "Chặng đường mới",
    message: "Một cánh cửa vừa mở ra, và mình tin Vũ sẽ bước qua nó theo cách rất riêng. Mong bạn gặp được người thầy tốt, người bạn tốt và những cơ hội khiến mình phải mỉm cười. Đừng sợ thử, cũng đừng quên nghỉ ngơi.",
  },
  {
    label: "Biết ơn",
    message: "Cảm ơn Vũ vì đã là một phần trong những năm tháng này. Mình chúc bạn mang theo những ký ức đẹp, nhưng đừng mang theo áp lực phải hoàn hảo. Mong chặng đường phía trước rộng mở và có nhiều người thương bạn như bạn xứng đáng.",
  },
  {
    label: "Can đảm",
    message: "Ra trường rồi, thế giới sẽ rộng hơn và cũng nhiều điều chưa biết hơn. Mình chúc Vũ đủ can đảm để chọn con đường mình muốn, đủ kiên nhẫn để đi tiếp khi mọi thứ chậm lại, và đủ dịu dàng để tha thứ cho chính mình khi cần.",
  },
  {
    label: "Bình an",
    message: "Không cần phải thành công thật nhanh đâu. Mình chúc Vũ có một cuộc sống bình an, một công việc mình không ghét, vài người bạn có thể gọi lúc nửa đêm và một trái tim còn biết rung động trước điều đẹp. Chúc mừng bạn!",
  },
  {
    label: "Ngắn mà thật lòng",
    message: "Chúc mừng Vũ tốt nghiệp! Mình vui vì được thấy bạn đi đến ngày này. Mong bạn khỏe, bình an và luôn có điều để mong chờ ở phía trước.",
  },
] as const;

export const wishesForGuests = [
  { title: "Bình an trong những ngày thường", text: "Mong bạn có sức khỏe, có một giấc ngủ ngon và có nơi để trở về sau một ngày mệt. Những điều nhỏ ấy cũng đáng để mình chúc nhau." },
  { title: "Can đảm cho những khởi đầu", text: "Nếu bạn cũng đang bắt đầu điều gì mới, mình chúc bạn đủ tự tin để thử. Chưa biết hết đường đi cũng không sao, mình cứ bước từng chút một." },
  { title: "Có người cùng chia sẻ", text: "Mong lúc vui bạn có người để kể, lúc buồn có người chịu ngồi nghe. Còn hôm nay, cảm ơn vì đã dành một chút thời gian để chia vui với mình." },
] as const;
