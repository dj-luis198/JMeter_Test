/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 67.54098360655738, "KoPercent": 32.459016393442624};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5156062424969988, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2656a97c-13c0-4ef3-8dfc-8868e1c0d497"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/02a4e17f-1e08-4db8-903e-c494ecb73196"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a23c110-e884-433a-a32f-febf488bc63d"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.65625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aa4eb4c4-0842-4abf-95e8-287ac3e519f2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02a4e17f-1e08-4db8-903e-c494ecb73196"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1fa47b2-de3d-498b-84d6-43d5b6487b68"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/59a27050-eeef-43e7-8f09-4d09ee086153"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87b1534d-d4d7-40cf-a3df-bff3a4261041"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.78125, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/87b1534d-d4d7-40cf-a3df-bff3a4261041"], "isController": false}, {"data": [0.9219653179190751, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59a27050-eeef-43e7-8f09-4d09ee086153"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dd307e2c-5bda-4f3a-81ce-73483849ff2d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/afdf72fe-3ea4-42e4-b0bc-1de4bb5f0b20"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d5ac3c38-88b5-4d2d-8fbc-ce65606f7e6d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c1fa47b2-de3d-498b-84d6-43d5b6487b68"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aa4eb4c4-0842-4abf-95e8-287ac3e519f2"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2dd5b55d-9577-4da6-a51e-e186ae31b0e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2656a97c-13c0-4ef3-8dfc-8868e1c0d497"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2dd5b55d-9577-4da6-a51e-e186ae31b0e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3cff43a7-64c7-480f-8a8f-302e76762da6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2a23c110-e884-433a-a32f-febf488bc63d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f2cac684-7596-476e-aaae-bd9581afdbe1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2cac684-7596-476e-aaae-bd9581afdbe1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/64befc86-e8bf-429a-b18f-09c02e456f20"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=afdf72fe-3ea4-42e4-b0bc-1de4bb5f0b20"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd307e2c-5bda-4f3a-81ce-73483849ff2d"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6e70a70-2a46-47a3-a32a-01e0f843f061"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/91ead765-69c0-4aca-84c3-e1443ea7fc09"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b6e70a70-2a46-47a3-a32a-01e0f843f061"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64befc86-e8bf-429a-b18f-09c02e456f20"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=91ead765-69c0-4aca-84c3-e1443ea7fc09"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3cff43a7-64c7-480f-8a8f-302e76762da6"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 610, 198, 32.459016393442624, 255.71311475409814, 82, 2094, 90.0, 675.6999999999997, 1014.3999999999978, 1713.5999999999995, 2.386046711753823, 2.5037867184719134, 1.1476356012837714], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 57, 100.0, 477.47368421052624, 338, 725, 507.0, 611.2, 643.1, 725.0, 0.24954141292974752, 1.6074745724961583, 0.41890789924437105], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 103.85714285714285, 85, 251, 88.0, 218.80000000000013, 250.9, 251.0, 0.10294723219012883, 0.07992485311635979, 0.03659452394258486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, 100.0, 103.11764705882354, 82, 248, 84.0, 246.4, 248.0, 248.0, 0.09827839378418064, 0.04885127191030073, 0.04933114687995005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 13, 100.0, 97.84615384615385, 83, 247, 85.0, 185.39999999999995, 247.0, 247.0, 0.09653011368277234, 0.04798225377395617, 0.04845359221967284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2656a97c-13c0-4ef3-8dfc-8868e1c0d497", 3, 0, 0.0, 589.0, 179, 1154, 434.0, 1154.0, 1154.0, 1154.0, 0.03582987973103703, 0.02986989648150581, 0.022976843447312163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02a4e17f-1e08-4db8-903e-c494ecb73196", 3, 0, 0.0, 292.3333333333333, 168, 508, 201.0, 508.0, 508.0, 508.0, 0.04189359028068705, 0.026933541928501607, 0.026865355746404133], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 2.8633191747572817, 6.001592839805825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a23c110-e884-433a-a32f-febf488bc63d", 1, 0, 0.0, 743.0, 743, 743, 743.0, 743.0, 743.0, 743.0, 1.3458950201884252, 0.24315486204576042, 0.927931527590848], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, 100.0, 154.71929824561403, 83, 460, 85.0, 340.2, 348.29999999999984, 460.0, 0.24719412978992839, 0.12287286334284525, 0.11949325609962358], "isController": false}, {"data": ["deleteBook", 16, 1, 6.25, 554.0625000000002, 85, 1389, 508.0, 1020.8000000000004, 1389.0, 1389.0, 0.09004902043549957, 0.01691167211181837, 0.06093588193166405], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 1, 6.25, 554.0625000000002, 85, 1389, 508.0, 1020.8000000000004, 1389.0, 1389.0, 0.08978826804042717, 0.016862701462426414, 0.06075943162623389], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 893.8749999999999, 143, 1662, 856.0, 1442.5, 1613.25, 1662.0, 0.0943978791943141, 0.029637615391574203, 0.04258966815212218], "isController": false}, {"data": ["deleteAccount", 15, 1, 6.666666666666667, 482.8666666666666, 84, 900, 437.0, 818.4000000000001, 900.0, 900.0, 0.0894161127835236, 0.018040399317457007, 0.060355876128878425], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 3.1234499007936507, 1.4105902777777777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1254.7619047619046, 821, 1782, 1086.0, 1770.2, 1780.9, 1782.0, 0.10994534145881762, 0.05690530368473959, 0.05057056233115537], "isController": false}, {"data": ["goToProfile", 16, 1, 6.25, 237.75, 84, 378, 203.5, 364.7, 378.0, 378.0, 0.0902613630594089, 0.166854608336201, 0.05787326775751284], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 1, 1, 100.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 5.988798945783132, 6.047628012048192], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aa4eb4c4-0842-4abf-95e8-287ac3e519f2", 1, 0, 0.0, 349.0, 349, 349, 349.0, 349.0, 349.0, 349.0, 2.865329512893983, 0.5176620702005731, 1.9755103868194843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02a4e17f-1e08-4db8-903e-c494ecb73196", 1, 0, 0.0, 992.0, 992, 992, 992.0, 992.0, 992.0, 992.0, 1.0080645161290323, 0.18212103074596775, 0.6950132308467742], "isController": false}, {"data": ["addBook", 58, 58, 100.0, 615.7068965517241, 351, 2358, 528.5, 788.0, 1130.4499999999975, 2358.0, 0.2825147711386807, 0.9518367493874788, 0.5514013630728839], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1fa47b2-de3d-498b-84d6-43d5b6487b68", 1, 0, 0.0, 953.0, 953, 953, 953.0, 953.0, 953.0, 953.0, 1.0493179433368311, 0.18957404249737672, 0.7234555351521511], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59a27050-eeef-43e7-8f09-4d09ee086153", 3, 0, 0.0, 319.6666666666667, 183, 398, 378.0, 398.0, 398.0, 398.0, 0.05235510724071133, 0.033659289323048465, 0.0335740759323572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87b1534d-d4d7-40cf-a3df-bff3a4261041", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 100.92307692307692, 84, 251, 86.0, 191.79999999999995, 251.0, 251.0, 0.09641413579560203, 0.07202813855823784, 0.03427221233359291], "isController": false}, {"data": ["deleteBooks", 16, 1, 6.25, 516.5, 103, 992, 404.0, 964.7, 992.0, 992.0, 0.08963685867628769, 0.016834266000179274, 0.06140102935327007], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/87b1534d-d4d7-40cf-a3df-bff3a4261041", 3, 0, 0.0, 283.6666666666667, 177, 375, 299.0, 375.0, 375.0, 375.0, 0.0400550088788603, 0.03339221280558634, 0.02568631754275872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 10, 5.780346820809249, 173.86705202312135, 84, 2094, 90.0, 320.5999999999999, 419.59999999999945, 1786.1599999999962, 0.7438428728673637, 1.6591056861520537, 0.3557178957093595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 119.4, 85, 252, 87.0, 252.0, 252.0, 252.0, 0.058517174790801096, 0.04531652305576687, 0.02080102697641758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59a27050-eeef-43e7-8f09-4d09ee086153", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 20, 20, 100.0, 115.6, 83, 353, 85.0, 246.9, 347.69999999999993, 353.0, 0.09559955259409386, 0.047519699482806425, 0.04798649417320727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd307e2c-5bda-4f3a-81ce-73483849ff2d", 3, 0, 0.0, 449.0, 321, 658, 368.0, 658.0, 658.0, 658.0, 0.06047777441790142, 0.027364617982058262, 0.03878294778752142], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 122.35, 84, 290, 87.0, 250.0, 288.0, 290.0, 0.11718040509266041, 0.09509464514843828, 0.04165397212278163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afdf72fe-3ea4-42e4-b0bc-1de4bb5f0b20", 3, 0, 0.0, 284.0, 168, 370, 314.0, 370.0, 370.0, 370.0, 0.04333819684209005, 0.02746727514698872, 0.027791747323866346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5ac3c38-88b5-4d2d-8fbc-ce65606f7e6d", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 1.46484375, 2.7370627866972477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1fa47b2-de3d-498b-84d6-43d5b6487b68", 3, 0, 0.0, 266.3333333333333, 170, 441, 188.0, 441.0, 441.0, 441.0, 0.02778498129144593, 0.028047274409106066, 0.017817842820360835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 560.9523809523811, 90, 1604, 477.0, 1173.2, 1563.0999999999995, 1604.0, 0.10651787978696424, 0.06542943983007862, 0.048161892911488716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa4eb4c4-0842-4abf-95e8-287ac3e519f2", 3, 0, 0.0, 306.3333333333333, 180, 437, 302.0, 437.0, 437.0, 437.0, 0.02095908786049631, 0.02477293229865303, 0.013440560900122961], "isController": false}, {"data": ["login", 21, 5, 23.80952380952381, 2068.0476190476193, 1367, 3173, 2051.0, 2928.8, 3155.7, 3173.0, 0.10623444424209312, 0.1586600358667719, 0.1593961283236205], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 5, 100.0, 116.2, 83, 246, 84.0, 246.0, 246.0, 246.0, 0.053753614930604085, 0.02671932617156004, 0.02698179499446338], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2dd5b55d-9577-4da6-a51e-e186ae31b0e6", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.5298066348973607, 2.021856671554252], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 96.47058823529412, 84, 250, 86.0, 128.3999999999999, 250.0, 250.0, 0.10050370090098612, 0.08136481254581787, 0.03572592492964741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 21, 100.0, 93.14285714285715, 82, 246, 85.0, 97.0, 231.1999999999998, 246.0, 0.10538624057169527, 0.05238437153417275, 0.05289895278696422], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2656a97c-13c0-4ef3-8dfc-8868e1c0d497", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2dd5b55d-9577-4da6-a51e-e186ae31b0e6", 3, 0, 0.0, 323.6666666666667, 173, 417, 381.0, 417.0, 417.0, 417.0, 0.031289764075178875, 0.02608498886605895, 0.020065376050814578], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 20, 0, 0.0, 111.15, 84, 254, 89.5, 239.60000000000025, 253.85, 254.0, 0.09794511155948207, 0.0812064450332034, 0.03481642637465964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3cff43a7-64c7-480f-8a8f-302e76762da6", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 18, 100.0, 94.94444444444443, 82, 250, 85.0, 108.70000000000022, 250.0, 250.0, 0.0799975111885408, 0.03976438788571022, 0.04015500073331052], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a23c110-e884-433a-a32f-febf488bc63d", 3, 0, 0.0, 324.0, 161, 635, 176.0, 635.0, 635.0, 635.0, 0.02518764797743187, 0.025113856039997984, 0.01615223519386093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2cac684-7596-476e-aaae-bd9581afdbe1", 3, 0, 0.0, 526.0, 287, 900, 391.0, 900.0, 900.0, 900.0, 0.04230536008912329, 0.02719827023958936, 0.027129413859235965], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2cac684-7596-476e-aaae-bd9581afdbe1", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 0.4896045054200542, 1.8684366531165313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64befc86-e8bf-429a-b18f-09c02e456f20", 3, 0, 0.0, 381.33333333333337, 174, 764, 206.0, 764.0, 764.0, 764.0, 0.02486180977400615, 0.025096507848044618, 0.015943282960544307], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 89.00000000000001, 83, 110, 87.0, 100.10000000000002, 110.0, 110.0, 0.08032881260626833, 0.06236465431834308, 0.028554382606134444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=afdf72fe-3ea4-42e4-b0bc-1de4bb5f0b20", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd307e2c-5bda-4f3a-81ce-73483849ff2d", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 0.72265625, 2.7578125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 20, 100.0, 105.45, 82, 343, 84.5, 234.50000000000034, 338.3999999999999, 343.0, 0.12139900210020274, 0.06034383991113593, 0.060936608476078326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6e70a70-2a46-47a3-a32a-01e0f843f061", 1, 0, 0.0, 786.0, 786, 786, 786.0, 786.0, 786.0, 786.0, 1.272264631043257, 0.22985249681933842, 0.8771668256997455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91ead765-69c0-4aca-84c3-e1443ea7fc09", 2, 0, 0.0, 249.5, 196, 303, 249.5, 303.0, 303.0, 303.0, 0.020519976196827612, 0.029016528840826547, 0.012754848485625758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 7, 100.0, 107.00000000000001, 83, 247, 84.0, 247.0, 247.0, 247.0, 0.0932425772248345, 0.04634811699945387, 0.052813178506253916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6e70a70-2a46-47a3-a32a-01e0f843f061", 3, 0, 0.0, 287.0, 182, 490, 189.0, 490.0, 490.0, 490.0, 0.03462563913158897, 0.028865970643228954, 0.02220459280248381], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64befc86-e8bf-429a-b18f-09c02e456f20", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=91ead765-69c0-4aca-84c3-e1443ea7fc09", 1, 0, 0.0, 859.0, 859, 859, 859.0, 859.0, 859.0, 859.0, 1.1641443538998835, 0.2103190483119907, 0.8026229627473807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3cff43a7-64c7-480f-8a8f-302e76762da6", 3, 0, 0.0, 327.6666666666667, 256, 368, 359.0, 368.0, 368.0, 368.0, 0.05782129365507671, 0.0371735204976486, 0.03707941031917354], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 893.8749999999999, 143, 1662, 856.0, 1442.5, 1613.25, 1662.0, 0.09795678473180248, 0.030754986612572754, 0.0441953462364187], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 3.5353535353535355, 1.1475409836065573], "isController": false}, {"data": ["401/Unauthorized", 12, 6.0606060606060606, 1.9672131147540983], "isController": false}, {"data": ["404/Not Found", 179, 90.4040404040404, 29.34426229508197], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 610, 198, "404/Not Found", 179, "401/Unauthorized", 12, "406/Not Acceptable", 7, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, "404/Not Found", 57, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 1, 1, "404/Not Found", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 20, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 5, "404/Not Found", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 21, "404/Not Found", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
