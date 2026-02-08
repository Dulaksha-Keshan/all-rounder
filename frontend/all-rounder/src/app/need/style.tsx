// import { colors } from './types';

// export const GlobalStyles = () => (
//   <style jsx global>{`
//     @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

//     * {
//       margin: 0;
//       padding: 0;
//       box-sizing: border-box;
//     }

//     body {
//       margin: 0;
//       padding: 0;
//     }

//     .help-page {
//       font-family: 'Outfit', system-ui, -apple-system, sans-serif;
//       color: ${colors.deepIndigo};
//       background: ${colors.ghostWhite};
//       min-height: 100vh;
//       position: relative;
//       overflow-x: hidden;
//     }

//     /* Background Orbs */
//     .background-container {
//       position: fixed;
//       top: 0;
//       left: 0;
//       width: 100%;
//       height: 100%;
//       pointer-events: none;
//       z-index: 0;
//       overflow: hidden;
//     }

//     .orb {
//       position: absolute;
//       border-radius: 50%;
//       filter: blur(100px);
//       opacity: 0.2;
//       animation: float 20s ease-in-out infinite;
//     }

//     .orb-1 {
//       width: 600px;
//       height: 600px;
//       background: ${colors.royalBlue};
//       top: -200px;
//       right: -200px;
//     }

//     .orb-2 {
//       width: 500px;
//       height: 500px;
//       background: ${colors.astralBlue};
//       bottom: -150px;
//       left: -150px;
//       animation-delay: -7s;
//     }

//     .orb-3 {
//       width: 400px;
//       height: 400px;
//       background: ${colors.lightLavender};
//       top: 50%;
//       left: 50%;
//       transform: translate(-50%, -50%);
//       animation-delay: -14s;
//     }

//     @keyframes float {
//       0%, 100% { transform: translate(0, 0); }
//       33% { transform: translate(50px, -50px); }
//       66% { transform: translate(-30px, 30px); }
//     }

//     /* Hero Section */
//     .hero-section {
//       position: relative;
//       padding: 120px 24px 160px;
//       background: linear-gradient(180deg, ${colors.deepIndigo} 0%, #2a2c4e 100%);
//       overflow: hidden;
//       z-index: 1;
//     }

//     .hero-grid {
//       position: absolute;
//       top: 0;
//       left: 0;
//       right: 0;
//       bottom: 0;
//       background-image: 
//         linear-gradient(rgba(131, 135, 204, 0.1) 1px, transparent 1px),
//         linear-gradient(90deg, rgba(131, 135, 204, 0.1) 1px, transparent 1px);
//       background-size: 50px 50px;
//       opacity: 0.3;
//       animation: gridMove 20s linear infinite;
//     }

//     @keyframes gridMove {
//       0% { transform: translate(0, 0); }
//       100% { transform: translate(50px, 50px); }
//     }

//     .hero-content {
//       max-width: 900px;
//       margin: 0 auto;
//       text-align: center;
//       position: relative;
//       z-index: 2;
//     }

//     .hero-badge {
//       display: inline-flex;
//       align-items: center;
//       gap: 8px;
//       padding: 10px 24px;
//       background: rgba(255, 255, 255, 0.1);
//       border: 1px solid rgba(255, 255, 255, 0.2);
//       border-radius: 100px;
//       color: white;
//       font-size: 14px;
//       font-weight: 600;
//       letter-spacing: 0.5px;
//       margin-bottom: 32px;
//       backdrop-filter: blur(10px);
//       animation: badgeFloat 3s ease-in-out infinite;
//     }

//     @keyframes badgeFloat {
//       0%, 100% { transform: translateY(0px); }
//       50% { transform: translateY(-5px); }
//     }

//     .hero-title {
//       font-size: clamp(40px, 7vw, 72px);
//       font-weight: 900;
//       color: white;
//       margin: 0 0 24px;
//       line-height: 1.1;
//       letter-spacing: -2px;
//     }

//     .gradient-text {
//       background: linear-gradient(135deg, ${colors.astralBlue}, ${colors.royalBlue}, #9d7bff);
//       background-size: 200% 200%;
//       -webkit-background-clip: text;
//       -webkit-text-fill-color: transparent;
//       background-clip: text;
//       animation: gradientShift 5s ease infinite;
//     }

//     @keyframes gradientShift {
//       0%, 100% { background-position: 0% 50%; }
//       50% { background-position: 100% 50%; }
//     }

//     .hero-subtitle {
//       font-size: 20px;
//       color: rgba(255, 255, 255, 0.7);
//       margin: 0 0 48px;
//       line-height: 1.6;
//       font-weight: 400;
//     }

//     /* Search */
//     .search-wrapper {
//       margin-bottom: 48px;
//     }

//     .search-container {
//       position: relative;
//       max-width: 700px;
//       margin: 0 auto;
//     }

//     .search-icon {
//       position: absolute;
//       left: 24px;
//       top: 50%;
//       transform: translateY(-50%);
//       color: ${colors.astralBlue};
//       z-index: 2;
//     }

//     .search-input {
//       width: 100%;
//       padding: 20px 60px 20px 60px;
//       border: 2px solid rgba(255, 255, 255, 0.1);
//       border-radius: 16px;
//       font-size: 16px;
//       font-weight: 500;
//       background: rgba(255, 255, 255, 0.95);
//       backdrop-filter: blur(20px);
//       box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
//       transition: all 0.4s ease;
//       color: ${colors.deepIndigo};
//     }

//     .search-input:focus {
//       outline: none;
//       border-color: ${colors.royalBlue};
//       box-shadow: 0 24px 70px rgba(65, 105, 225, 0.3);
//       transform: translateY(-2px);
//     }

//     .search-input::placeholder {
//       color: #999;
//     }

//     .clear-search {
//       position: absolute;
//       right: 20px;
//       top: 50%;
//       transform: translateY(-50%);
//       background: ${colors.lightLavender};
//       border: none;
//       width: 32px;
//       height: 32px;
//       border-radius: 50%;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       cursor: pointer;
//       transition: all 0.3s ease;
//       color: ${colors.deepIndigo};
//     }

//     .clear-search:hover {
//       background: ${colors.astralBlue};
//       color: white;
//       transform: translateY(-50%) rotate(90deg);
//     }

//     .search-results-count {
//       text-align: center;
//       margin-top: 16px;
//       font-size: 14px;
//       color: rgba(255, 255, 255, 0.6);
//       animation: fadeIn 0.3s ease;
//     }

//     @keyframes fadeIn {
//       from { opacity: 0; transform: translateY(-10px); }
//       to { opacity: 1; transform: translateY(0); }
//     }

//     /* Stats Grid */
//     .stats-grid {
//       display: grid;
//       grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
//       gap: 24px;
//       max-width: 700px;
//       margin: 0 auto;
//     }

//     .stat-item {
//       display: flex;
//       align-items: center;
//       gap: 12px;
//       padding: 20px 24px;
//       background: rgba(255, 255, 255, 0.1);
//       border: 1px solid rgba(255, 255, 255, 0.15);
//       border-radius: 12px;
//       backdrop-filter: blur(10px);
//       color: white;
//       transition: all 0.3s ease;
//     }

//     .stat-item:hover {
//       background: rgba(255, 255, 255, 0.15);
//       transform: translateY(-2px);
//     }

//     .stat-value {
//       font-size: 24px;
//       font-weight: 800;
//       line-height: 1;
//     }

//     .stat-label {
//       font-size: 12px;
//       opacity: 0.7;
//       font-weight: 500;
//     }

//     /* Container */
//     .container {
//       max-width: 1300px;
//       margin: 0 auto;
//       padding: 0 24px;
//       position: relative;
//       z-index: 1;
//     }

//     /* Section Headers */
//     .section-header {
//       text-align: center;
//       margin-bottom: 64px;
//     }

//     .section-title {
//       font-size: clamp(32px, 5vw, 48px);
//       font-weight: 800;
//       color: ${colors.deepIndigo};
//       margin: 0 0 16px;
//       letter-spacing: -1px;
//     }

//     .section-subtitle {
//       font-size: 18px;
//       color: #666;
//       margin: 0;
//       font-weight: 500;
//     }

//     /* Quick Help Section */
//     .quick-help-section {
//       padding: 100px 24px;
//       margin-top: -80px;
//       position: relative;
//       z-index: 1;
//     }

//     .help-grid {
//       display: grid;
//       grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
//       gap: 32px;
//     }

//     .help-card {
//       position: relative;
//       background: white;
//       padding: 40px 32px;
//       border-radius: 24px;
//       border: 1px solid rgba(220, 208, 255, 0.3);
//       transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
//       overflow: hidden;
//     }

//     .help-card::before {
//       content: '';
//       position: absolute;
//       top: 0;
//       left: 0;
//       right: 0;
//       height: 3px;
//       background: linear-gradient(90deg, ${colors.astralBlue}, ${colors.royalBlue});
//       transform: scaleX(0);
//       transition: transform 0.5s ease;
//     }

//     .help-card:hover::before {
//       transform: scaleX(1);
//     }

//     .help-card:hover {
//       transform: translateY(-8px);
//       box-shadow: 0 24px 60px rgba(0, 0, 0, 0.12);
//       border-color: ${colors.astralBlue};
//     }

//     .help-card-glow {
//       position: absolute;
//       top: 0;
//       left: 0;
//       right: 0;
//       bottom: 0;
//       background: radial-gradient(circle at top, rgba(220, 208, 255, 0.2), transparent 70%);
//       opacity: 0;
//       transition: opacity 0.5s ease;
//       pointer-events: none;
//     }

//     .help-card:hover .help-card-glow {
//       opacity: 1;
//     }

//     .help-card-icon {
//       width: 72px;
//       height: 72px;
//       border-radius: 18px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       color: white;
//       margin-bottom: 24px;
//       box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
//       transition: all 0.4s ease;
//     }

//     .help-card:hover .help-card-icon {
//       transform: scale(1.1) rotate(5deg);
//       box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
//     }

//     .help-card-title {
//       font-size: 24px;
//       font-weight: 700;
//       color: ${colors.deepIndigo};
//       margin: 0 0 12px;
//       letter-spacing: -0.5px;
//     }

//     .help-card-description {
//       font-size: 15px;
//       color: #666;
//       margin: 0 0 28px;
//       line-height: 1.6;
//     }

//     .help-card-links {
//       list-style: none;
//       padding: 0;
//       margin: 0;
//     }

//     .help-card-links li {
//       margin-bottom: 12px;
//     }

//     .help-link {
//       display: flex;
//       align-items: center;
//       gap: 10px;
//       color: ${colors.deepIndigo};
//       text-decoration: none;
//       font-size: 15px;
//       font-weight: 600;
//       transition: all 0.3s ease;
//       padding: 8px 0;
//     }

//     .help-link svg:first-child {
//       color: ${colors.royalBlue};
//       flex-shrink: 0;
//     }

//     .link-arrow {
//       margin-left: auto;
//       opacity: 0;
//       transform: translateX(-10px);
//       transition: all 0.3s ease;
//     }

//     .help-link:hover {
//       color: ${colors.royalBlue};
//       padding-left: 8px;
//     }

//     .help-link:hover .link-arrow {
//       opacity: 1;
//       transform: translateX(0);
//     }

//     /* Modal Styles */
//     .modal-overlay {
//       position: fixed;
//       top: 0;
//       left: 0;
//       right: 0;
//       bottom: 0;
//       background: rgba(0, 0, 0, 0.7);
//       backdrop-filter: blur(8px);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       z-index: 1000;
//       padding: 24px;
//       animation: modalFadeIn 0.3s ease;
//     }

//     @keyframes modalFadeIn {
//       from { opacity: 0; }
//       to { opacity: 1; }
//     }

//     .modal-content {
//       position: relative;
//       background: white;
//       border-radius: 32px;
//       max-width: 600px;
//       width: 100%;
//       max-height: 90vh;
//       overflow-y: auto;
//       padding: 48px;
//       animation: modalSlideUp 0.3s ease;
//       box-shadow: 0 32px 80px rgba(0, 0, 0, 0.3);
//     }

//     @keyframes modalSlideUp {
//       from { 
//         opacity: 0;
//         transform: translateY(30px) scale(0.95);
//       }
//       to { 
//         opacity: 1;
//         transform: translateY(0) scale(1);
//       }
//     }

//     .modal-close {
//       position: absolute;
//       top: 24px;
//       right: 24px;
//       background: ${colors.lightLavender};
//       border: none;
//       width: 40px;
//       height: 40px;
//       border-radius: 50%;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       cursor: pointer;
//       transition: all 0.3s ease;
//       color: ${colors.deepIndigo};
//     }

//     .modal-close:hover {
//       background: ${colors.astralBlue};
//       color: white;
//       transform: rotate(90deg);
//     }

//     .modal-icon {
//       width: 96px;
//       height: 96px;
//       border-radius: 24px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       color: white;
//       margin: 0 auto 32px;
//       box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
//     }

//     .modal-title {
//       font-size: 32px;
//       font-weight: 800;
//       color: ${colors.deepIndigo};
//       margin: 0 0 16px;
//       text-align: center;
//       letter-spacing: -1px;
//     }

//     .modal-description {
//       font-size: 16px;
//       line-height: 1.8;
//       color: #555;
//       margin: 0 0 32px;
//       text-align: center;
//     }

//     .modal-links {
//       border-top: 2px solid ${colors.lightLavender};
//       padding-top: 24px;
//     }

//     .modal-links-title {
//       font-size: 18px;
//       font-weight: 700;
//       color: ${colors.deepIndigo};
//       margin: 0 0 16px;
//     }

//     .modal-links-list {
//       list-style: none;
//       padding: 0;
//       margin: 0;
//     }

//     .modal-links-list li {
//       margin-bottom: 12px;
//     }

//     .modal-link {
//       display: flex;
//       align-items: center;
//       gap: 12px;
//       padding: 12px 16px;
//       background: ${colors.ghostWhite};
//       border-radius: 12px;
//       color: ${colors.deepIndigo};
//       text-decoration: none;
//       font-size: 15px;
//       font-weight: 600;
//       transition: all 0.3s ease;
//     }

//     .modal-link svg:first-child {
//       color: ${colors.royalBlue};
//       flex-shrink: 0;
//     }

//     .modal-link svg:last-child {
//       margin-left: auto;
//       opacity: 0;
//       transition: all 0.3s ease;
//     }

//     .modal-link:hover {
//       background: ${colors.lightLavender};
//       transform: translateX(4px);
//     }

//     .modal-link:hover svg:last-child {
//       opacity: 1;
//     }

//     /* FAQ Section */
//     .faq-section {
//       padding: 80px 24px 100px;
//       background: linear-gradient(180deg, ${colors.ghostWhite}, white);
//       position: relative;
//       z-index: 1;
//     }

//     .category-filter {
//       display: flex;
//       flex-wrap: wrap;
//       gap: 12px;
//       justify-content: center;
//       margin-bottom: 56px;
//     }

//     .category-pill {
//       position: relative;
//       padding: 12px 28px;
//       border: 2px solid ${colors.lightLavender};
//       background: white;
//       border-radius: 100px;
//       font-size: 15px;
//       font-weight: 600;
//       color: ${colors.deepIndigo};
//       cursor: pointer;
//       transition: all 0.4s ease;
//       box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
//     }

//     .category-pill:hover {
//       transform: translateY(-2px);
//       box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
//       border-color: ${colors.astralBlue};
//     }

//     .category-pill.active {
//       background: linear-gradient(135deg, ${colors.royalBlue}, ${colors.astralBlue});
//       color: white;
//       border-color: ${colors.royalBlue};
//       box-shadow: 0 8px 24px rgba(65, 105, 225, 0.3);
//     }

//     .faq-list {
//       max-width: 950px;
//       margin: 0 auto;
//     }

//     .faq-item {
//       background: white;
//       border-radius: 20px;
//       margin-bottom: 20px;
//       overflow: hidden;
//       border: 2px solid rgba(220, 208, 255, 0.2);
//       transition: all 0.4s ease;
//     }

//     .faq-item:hover {
//       border-color: rgba(131, 135, 204, 0.4);
//       box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
//     }

//     .faq-item.open {
//       border-color: ${colors.royalBlue};
//       box-shadow: 0 16px 40px rgba(65, 105, 225, 0.15);
//     }

//     .faq-question {
//       width: 100%;
//       padding: 28px 32px;
//       background: none;
//       border: none;
//       text-align: left;
//       font-size: 18px;
//       font-weight: 700;
//       color: ${colors.deepIndigo};
//       cursor: pointer;
//       display: flex;
//       align-items: center;
//       gap: 20px;
//       transition: all 0.3s ease;
//     }

//     .faq-number {
//       font-size: 14px;
//       font-weight: 800;
//       color: ${colors.astralBlue};
//       opacity: 0.5;
//       min-width: 32px;
//     }

//     .faq-text {
//       flex: 1;
//     }

//     .faq-icon-wrapper {
//       width: 36px;
//       height: 36px;
//       background: ${colors.lightLavender};
//       border-radius: 50%;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       transition: all 0.4s ease;
//       flex-shrink: 0;
//     }

//     .faq-item.open .faq-icon-wrapper {
//       background: ${colors.royalBlue};
//       transform: rotate(180deg);
//     }

//     .faq-icon {
//       color: ${colors.deepIndigo};
//       transition: color 0.3s ease;
//     }

//     .faq-item.open .faq-icon {
//       color: white;
//     }

//     .faq-answer-wrapper {
//       display: grid;
//       grid-template-rows: 0fr;
//       transition: grid-template-rows 0.4s ease;
//     }

//     .faq-item.open .faq-answer-wrapper {
//       grid-template-rows: 1fr;
//     }

//     .faq-answer {
//       overflow: hidden;
//     }

//     .faq-answer p {
//       margin: 0;
//       padding: 0 32px 28px 84px;
//       font-size: 16px;
//       line-height: 1.8;
//       color: #555;
//     }

//     .no-results {
//       text-align: center;
//       padding: 80px 24px;
//     }

//     .no-results-icon {
//       width: 120px;
//       height: 120px;
//       margin: 0 auto 24px;
//       background: ${colors.lightLavender};
//       border-radius: 50%;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       color: ${colors.astralBlue};
//     }

//     .no-results h3 {
//       font-size: 24px;
//       font-weight: 700;
//       color: ${colors.deepIndigo};
//       margin: 0 0 12px;
//     }

//     .no-results p {
//       font-size: 16px;
//       color: #666;
//       margin: 0;
//     }

//     /* Support Section */
//     .support-section {
//       padding: 80px 24px 120px;
//       background: white;
//       position: relative;
//       z-index: 1;
//     }

//     .support-card {
//       position: relative;
//       max-width: 800px;
//       margin: 0 auto;
//       text-align: center;
//       padding: 72px 48px;
//       background: linear-gradient(135deg, ${colors.deepIndigo} 0%, #2a2c4e 100%);
//       border-radius: 32px;
//       overflow: hidden;
//     }

//     .support-card-glow {
//       position: absolute;
//       top: -50%;
//       left: -50%;
//       width: 200%;
//       height: 200%;
//       background: radial-gradient(circle, rgba(131, 135, 204, 0.3), transparent 70%);
//       animation: rotate 20s linear infinite;
//     }

//     @keyframes rotate {
//       from { transform: rotate(0deg); }
//       to { transform: rotate(360deg); }
//     }

//     .support-icon-wrapper {
//       position: relative;
//       width: 120px;
//       height: 120px;
//       margin: 0 auto 32px;
//       background: linear-gradient(135deg, ${colors.astralBlue}, ${colors.royalBlue});
//       border-radius: 50%;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       color: white;
//       box-shadow: 0 20px 60px rgba(65, 105, 225, 0.4);
//       animation: pulse 3s ease-in-out infinite;
//       z-index: 1;
//     }

//     @keyframes pulse {
//       0%, 100% { transform: scale(1); }
//       50% { transform: scale(1.05); }
//     }

//     .support-title {
//       position: relative;
//       font-size: 36px;
//       font-weight: 800;
//       color: white;
//       margin: 0 0 16px;
//       letter-spacing: -1px;
//       z-index: 1;
//     }

//     .support-text {
//       position: relative;
//       font-size: 18px;
//       color: rgba(255, 255, 255, 0.8);
//       margin: 0 0 40px;
//       line-height: 1.6;
//       max-width: 500px;
//       margin-left: auto;
//       margin-right: auto;
//       z-index: 1;
//     }

//     .support-buttons {
//       position: relative;
//       display: flex;
//       gap: 16px;
//       justify-content: center;
//       flex-wrap: wrap;
//       margin-bottom: 32px;
//       z-index: 1;
//     }

//     .btn {
//       display: inline-flex;
//       align-items: center;
//       gap: 10px;
//       padding: 16px 32px;
//       border-radius: 14px;
//       font-size: 16px;
//       font-weight: 700;
//       text-decoration: none;
//       transition: all 0.4s ease;
//       cursor: pointer;
//       border: 2px solid transparent;
//     }

//     .btn-primary {
//       background: white;
//       color: ${colors.deepIndigo};
//     }

//     .btn-primary:hover {
//       transform: translateY(-3px);
//       box-shadow: 0 12px 32px rgba(255, 255, 255, 0.3);
//     }

//     .support-meta {
//       position: relative;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       gap: 16px;
//       font-size: 14px;
//       color: rgba(255, 255, 255, 0.6);
//       flex-wrap: wrap;
//       z-index: 1;
//     }

//     .separator {
//       opacity: 0.3;
//     }

//     /* Responsive */
//     @media (max-width: 768px) {
//       .hero-section {
//         padding: 80px 20px 120px;
//       }

//       .stats-grid {
//         grid-template-columns: 1fr;
//         gap: 16px;
//       }

//       .help-grid {
//         grid-template-columns: 1fr;
//       }

//       .faq-answer p {
//         padding-left: 32px;
//       }

//       .support-card {
//         padding: 48px 24px;
//       }

//       .support-buttons {
//         flex-direction: column;
//       }

//       .btn {
//         width: 100%;
//         justify-content: center;
//       }

//       .modal-content {
//         padding: 32px 24px;
//       }
//     }
//   `}</style>
// );