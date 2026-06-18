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

    var data = {"OkPercent": 98.73228933631619, "KoPercent": 1.267710663683818};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8163134232498395, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4051724137931034, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b78256a6-071b-4011-a1ef-1f1fbea2586f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/84958e24-6f5d-449d-bff4-5af24cac4b1f"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b1eae44-d323-4799-a643-1f345c555ccf"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/99091548-018b-4af5-afdf-f93cc3bef35d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4f76cbf-1b26-4d7c-b13f-853683bd33ac"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c4939fa-6fdf-4c19-9952-208af5156f59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ad5f95e7-44ff-4605-844d-9b091d96b992"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4965c56-24e3-49cb-a442-33582cbd0f21"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ae37966e-7314-4be4-809a-37d8b0da3b17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dd8828fa-1986-4302-a41c-37ba58912787"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06818181818181818, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d5907f6-1f89-4892-98ba-5da49b8a54c9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e4f76cbf-1b26-4d7c-b13f-853683bd33ac"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f937d239-1964-49a7-a4da-00686cee74c8"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/da0d32ee-e61f-46de-954e-71ce1cb8accc"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/141160d1-279f-4998-ab24-56f72f500c2c"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99091548-018b-4af5-afdf-f93cc3bef35d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd8828fa-1986-4302-a41c-37ba58912787"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1dd5fb86-a5fb-4b7c-b476-5b7f1740ce20"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c4965c56-24e3-49cb-a442-33582cbd0f21"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b78256a6-071b-4011-a1ef-1f1fbea2586f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84958e24-6f5d-449d-bff4-5af24cac4b1f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4b1eae44-d323-4799-a643-1f345c555ccf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae37966e-7314-4be4-809a-37d8b0da3b17"], "isController": false}, {"data": [0.32786885245901637, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d5907f6-1f89-4892-98ba-5da49b8a54c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1f4b0a12-bdd1-4828-bf0b-0e0bad4edd93"], "isController": false}, {"data": [0.7758620689655172, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad5f95e7-44ff-4605-844d-9b091d96b992"], "isController": false}, {"data": [0.9472222222222222, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da0d32ee-e61f-46de-954e-71ce1cb8accc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4a3a550b-54dc-491c-ad08-02d63943eb61"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f937d239-1964-49a7-a4da-00686cee74c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fc1ba435-351e-4d17-9af5-51505d62685f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1341, 17, 1.267710663683818, 309.14168530947074, 81, 2195, 96.0, 849.1999999999998, 1062.8999999999999, 1494.4799999999996, 5.188945726955432, 734.7826612041179, 3.787505949294597], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1357.8793103448272, 1010, 1845, 1342.5, 1655.2, 1692.7499999999998, 1845.0, 0.2529900810440639, 304.4316559427588, 1.243950252008654], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b78256a6-071b-4011-a1ef-1f1fbea2586f", 3, 0, 0.0, 390.3333333333333, 176, 540, 455.0, 540.0, 540.0, 540.0, 0.08955758552749418, 0.04052247522240134, 0.057431133948295424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84958e24-6f5d-449d-bff4-5af24cac4b1f", 3, 0, 0.0, 633.6666666666666, 200, 924, 777.0, 924.0, 924.0, 924.0, 0.017846307598957774, 0.024602575742703834, 0.011444409495425396], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 589.5384615384617, 89, 1212, 516.0, 1194.0, 1212.0, 1212.0, 0.06777328272928222, 0.012839860204571047, 0.0458151871454936], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 589.5384615384617, 89, 1212, 516.0, 1194.0, 1212.0, 1212.0, 0.06778600479716342, 0.012842270440087601, 0.045823787347481486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 100.54999999999998, 82, 249, 84.0, 232.10000000000034, 248.95, 249.0, 0.10975442447523666, 0.03761018315269585, 0.062133437371381536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 85.95, 83, 100, 85.0, 87.0, 99.35, 100.0, 0.10975382217685731, 0.08156509636385587, 0.05509127402236783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b1eae44-d323-4799-a643-1f345c555ccf", 1, 0, 0.0, 681.0, 681, 681, 681.0, 681.0, 681.0, 681.0, 1.4684287812041115, 0.26529230910425844, 1.012412812041116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 162.65000000000003, 82, 661, 84.0, 253.9, 640.6499999999996, 661.0, 0.10965212862194687, 1.6401452719372789, 0.06409937909482168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 149.85000000000002, 82, 568, 84.0, 252.8, 552.2499999999998, 568.0, 0.10965212862194687, 4.961335845623509, 0.06399229693796431], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99091548-018b-4af5-afdf-f93cc3bef35d", 3, 0, 0.0, 348.0, 194, 455, 395.0, 455.0, 455.0, 455.0, 0.04510599909788002, 0.028998811268982107, 0.028925396556908733], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4f76cbf-1b26-4d7c-b13f-853683bd33ac", 1, 0, 0.0, 833.0, 833, 833, 833.0, 833.0, 833.0, 833.0, 1.2004801920768307, 0.21688362845138057, 0.8276748199279712], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 216.85714285714286, 83, 659, 190.0, 486.5, 659.0, 659.0, 0.06519451248474914, 0.1282561966802023, 0.042138138440547264], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 86.93333333333332, 83, 101, 85.0, 99.2, 101.0, 101.0, 0.0821359733660417, 0.06104050364409935, 0.0412284085060014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c4939fa-6fdf-4c19-9952-208af5156f59", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 1.5134404620853081, 2.827865817535545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 95.6, 82, 250, 84.0, 154.00000000000006, 250.0, 250.0, 0.08213867198195139, 0.038427636514472834, 0.0459249293607421], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 655.5, 648, 660, 657.0, 660.0, 660.0, 660.0, 0.052133566196595676, 15.32899945911425, 0.029732424471495975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 836.25, 739, 981, 812.5, 981.0, 981.0, 981.0, 0.05207994271206302, 46.8616239990886, 0.029650983008918688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad5f95e7-44ff-4605-844d-9b091d96b992", 3, 0, 0.0, 390.33333333333337, 182, 680, 309.0, 680.0, 680.0, 680.0, 0.07452305246422893, 0.03454453994435612, 0.04778984809717806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 167.5, 83, 252, 167.5, 252.0, 252.0, 252.0, 0.0524129617254347, 0.09274637367821063, 0.02902163017414207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 85.92307692307692, 83, 100, 85.0, 94.8, 100.0, 100.0, 0.06177591499634097, 0.04590963995333543, 0.031008613582147713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 83.92307692307692, 82, 86, 84.0, 85.6, 86.0, 86.0, 0.06177679568512842, 0.016530119157934755, 0.0352320787891748], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4965c56-24e3-49cb-a442-33582cbd0f21", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.5089128521126761, 1.9421214788732395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae37966e-7314-4be4-809a-37d8b0da3b17", 3, 0, 0.0, 833.3333333333334, 198, 1925, 377.0, 1925.0, 1925.0, 1925.0, 0.11307527043835514, 0.0511636152048547, 0.07251246183709623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 109.38461538461539, 83, 251, 84.0, 249.8, 251.0, 251.0, 0.06177708925363773, 0.01665085608789454, 0.03631817161200186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 122.3846153846154, 83, 251, 85.0, 250.6, 251.0, 251.0, 0.061728101955831165, 0.01663765248028262, 0.03634965378844355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 89.75, 84, 104, 85.5, 104.0, 104.0, 104.0, 0.052527905449770186, 0.0390368516086671, 0.02949565003282994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 638.0555555555557, 83, 1211, 908.0, 1155.2, 1211.0, 1211.0, 0.10705873956177289, 53.53040365977327, 0.05782751796207741], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd8828fa-1986-4302-a41c-37ba58912787", 3, 0, 0.0, 283.6666666666667, 188, 457, 206.0, 457.0, 457.0, 457.0, 0.02739350773866594, 0.02747376215586906, 0.017566800210016893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 224.99999999999994, 82, 1062, 85.0, 1057.8, 1062.0, 1062.0, 0.08213867198195139, 9.873656604907513, 0.04734738292501287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 390.94444444444434, 82, 752, 514.0, 669.2000000000002, 752.0, 752.0, 0.10705810281146473, 17.50095627419959, 0.05793172295147294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 188.93333333333337, 82, 747, 85.0, 696.0, 747.0, 747.0, 0.082064524600209, 3.2364624308606382, 0.0473847831171389], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 399.7692307692307, 86, 833, 403.0, 772.1999999999999, 833.0, 833.0, 0.0680560572508494, 0.012893432721352327, 0.04654825730686476], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 234.76923076923077, 167, 351, 171.0, 345.4, 351.0, 351.0, 0.06170231953258119, 0.09562654404121715, 0.13876996277688916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 556.7272727272727, 128, 1462, 554.0, 1047.6999999999998, 1411.5999999999992, 1462.0, 0.09035686855950617, 0.05550241242571228, 0.04085471693657358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 95.44444444444444, 83, 251, 85.0, 110.60000000000022, 251.0, 251.0, 0.10705619260598563, 0.07956031501284674, 0.05373719042917638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 130.44444444444446, 82, 253, 85.0, 252.1, 253.0, 253.0, 0.10705937631965551, 0.11797906097031481, 0.05606212566391683], "isController": false}, {"data": ["login", 22, 0, 0.0, 2383.0909090909086, 1347, 3708, 2350.0, 3431.4, 3668.8499999999995, 3708.0, 0.09299415827605739, 20.357431765536365, 0.16834551503969158], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 89.73333333333333, 84, 107, 86.0, 102.8, 107.0, 107.0, 0.07993605115907275, 0.0647138539168665, 0.028414768185451637], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d5907f6-1f89-4892-98ba-5da49b8a54c9", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4f76cbf-1b26-4d7c-b13f-853683bd33ac", 3, 0, 0.0, 502.0, 194, 846, 466.0, 846.0, 846.0, 846.0, 0.022066936373666787, 0.030421053236484003, 0.014150997609415227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f937d239-1964-49a7-a4da-00686cee74c8", 3, 0, 0.0, 527.0, 314, 951, 316.0, 951.0, 951.0, 951.0, 0.020071722956698606, 0.023724097023363484, 0.012871515047101644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 735.1111111111111, 168, 1308, 995.0, 1246.8000000000002, 1308.0, 1308.0, 0.10699828208313766, 71.18878063568869, 0.22543246996617664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da0d32ee-e61f-46de-954e-71ce1cb8accc", 3, 0, 0.0, 493.6666666666667, 183, 913, 385.0, 913.0, 913.0, 913.0, 0.03956530913694872, 0.032983970279858624, 0.025372284830660476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 282.74999999999994, 169, 744, 330.5, 340.8, 723.8499999999997, 744.0, 0.10960105217010084, 6.7174153074994525, 0.2450932122698378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 3, 42.857142857142854, 565.4285714285714, 83, 1085, 826.0, 1085.0, 1085.0, 1085.0, 0.07408504963698324, 50.65505322878521, 0.11631600845627924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/141160d1-279f-4998-ab24-56f72f500c2c", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 1.7261402027027026, 3.2252956081081083], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 1129.909090909091, 453, 2105, 1022.5, 2062.4, 2101.85, 2105.0, 0.0926569376882094, 0.029448849158717122, 0.0418042043085476], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99091548-018b-4af5-afdf-f93cc3bef35d", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd8828fa-1986-4302-a41c-37ba58912787", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 345.9333333333334, 168, 1154, 176.0, 1149.2, 1154.0, 1154.0, 0.08202458550242793, 13.194161891582636, 0.1816769806886784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 87.78571428571428, 83, 108, 86.5, 98.0, 108.0, 108.0, 0.07152564194263644, 0.05553016146913668, 0.025425130534296545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1dd5fb86-a5fb-4b7c-b476-5b7f1740ce20", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 1.1486904226618704, 2.146329811151079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 326.5789473684211, 169, 1140, 187.0, 995.0, 1140.0, 1140.0, 0.09549658222758343, 12.15843381678478, 0.21220208364746682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4965c56-24e3-49cb-a442-33582cbd0f21", 3, 0, 0.0, 286.6666666666667, 176, 500, 184.0, 500.0, 500.0, 500.0, 0.03906656943431607, 0.03256819151083446, 0.025052455008334203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 140.75000000000003, 84, 250, 87.0, 249.7, 250.0, 250.0, 0.05771506074510143, 0.04289175901076386, 0.02897025510056849], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 111.41666666666667, 81, 250, 84.0, 249.1, 250.0, 250.0, 0.05771617110920862, 0.029891415440999648, 0.03210837774272055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 284.0, 81, 1020, 166.5, 981.6000000000001, 1020.0, 1020.0, 0.05771644870691107, 8.668523989000207, 0.03310429121796136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 207.41666666666669, 82, 656, 89.5, 606.8000000000002, 656.0, 656.0, 0.05771589351417646, 2.841361704302239, 0.03316033595459683], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 86.0, 11.627906976744185, 3.429324127906977, 7.18795421511628], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b78256a6-071b-4011-a1ef-1f1fbea2586f", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 0.9508634868421052, 3.6287006578947367], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 938.4999999999999, 660, 1491, 904.0, 1310.1, 1334.6999999999998, 1491.0, 0.2655337227827934, 317.6706469065321, 0.5243253783855549], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 1129.909090909091, 453, 2105, 1022.5, 2062.4, 2101.85, 2105.0, 0.09282191272208697, 0.029501282630066704, 0.04187863640391033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 84.37499999999999, 83, 86, 84.0, 86.0, 86.0, 86.0, 0.042059661630022185, 0.011336393173716918, 0.02476755465127283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84958e24-6f5d-449d-bff4-5af24cac4b1f", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.3290784380692167, 1.2558344717668488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 105.375, 83, 253, 85.0, 253.0, 253.0, 253.0, 0.04205921938088829, 0.011336273973755048, 0.02472622076884253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 95.35714285714286, 81, 246, 84.0, 166.0, 246.0, 246.0, 0.07155159636722323, 0.019285391208353136, 0.0420645127080746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 145.07142857142856, 83, 276, 84.5, 264.0, 276.0, 276.0, 0.07148911833491631, 0.01926855142620791, 0.042097596050736846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 84.5, 82, 88, 84.0, 88.0, 88.0, 88.0, 0.042059661630022185, 0.011254245397095781, 0.02398715077337203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 85.21428571428572, 84, 87, 85.0, 86.5, 87.0, 87.0, 0.07154940230695717, 0.05317294448788515, 0.03591444607985935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 87.25, 85, 97, 85.5, 97.0, 97.0, 97.0, 0.042058777141054625, 0.031256571683928286, 0.021111534619630935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 131.50000000000003, 83, 252, 85.0, 251.5, 252.0, 252.0, 0.07148911833491631, 0.019128924241960027, 0.040771137800381954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 88.25, 86, 92, 88.0, 92.0, 92.0, 92.0, 0.04211967251954617, 0.03315278911206465, 0.014972227340932424], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 643.3846153846152, 84, 1925, 466.0, 1535.3999999999996, 1925.0, 1925.0, 0.06628594737915561, 0.012418656307362838, 0.04511348281664287], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1365.9090909090908, 930, 2195, 1224.5, 2068.5, 2186.15, 2195.0, 0.09188911489898463, 0.04755979579732603, 0.04226540343498218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 194.375, 170, 342, 172.5, 342.0, 342.0, 342.0, 0.04203999054100213, 0.06515377440290077, 0.0945489240389921], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b1eae44-d323-4799-a643-1f345c555ccf", 3, 0, 0.0, 473.0, 317, 659, 443.0, 659.0, 659.0, 659.0, 0.02262136361579876, 0.022687637142016923, 0.014506538516641784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae37966e-7314-4be4-809a-37d8b0da3b17", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 166.0, 6.024096385542169, 1.0883377259036144, 4.153332078313253], "isController": false}, {"data": ["addBook", 61, 8, 13.114754098360656, 918.4262295081969, 427, 1982, 706.0, 1672.8000000000002, 1768.8, 1982.0, 0.28072565280219425, 94.67334668841524, 1.0192439088861174], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3d5907f6-1f89-4892-98ba-5da49b8a54c9", 3, 0, 0.0, 278.0, 182, 466, 186.0, 466.0, 466.0, 466.0, 0.017394329448599755, 0.023979487374615874, 0.011154566736243985], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 145.91379310344826, 83, 361, 86.0, 339.2, 348.29999999999995, 361.0, 0.2664326958854523, 0.19800320465705978, 0.12879314888994034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f4b0a12-bdd1-4828-bf0b-0e0bad4edd93", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.8247767857142858, 3.4095982142857144], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 554.3448275862069, 404, 828, 495.5, 742.1, 753.8999999999997, 828.0, 0.26611241873247904, 78.24588687125205, 0.1338358355929948], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 144.79310344827584, 82, 348, 88.0, 253.5, 335.29999999999995, 348.0, 0.26660905459509904, 0.47177305363898375, 0.12965948162925714], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 789.3965517241379, 571, 1141, 793.0, 985.2, 1056.6499999999999, 1141.0, 0.26601477757954073, 239.36056447017197, 0.1335269489022304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 117.10526315789474, 85, 255, 91.0, 252.0, 255.0, 255.0, 0.09345012960057447, 0.06981381752386667, 0.033218600756454206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad5f95e7-44ff-4605-844d-9b091d96b992", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 0.9458851439790575, 3.60970222513089], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 8, 4.444444444444445, 137.73333333333338, 83, 670, 90.0, 243.9, 287.79999999999995, 667.5699999999999, 0.7641916762544418, 1.6447451341156392, 0.36744385579278516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 101.41666666666666, 85, 252, 87.0, 205.20000000000016, 252.0, 252.0, 0.05846186824643626, 0.04527369289006246, 0.02078136722822539], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da0d32ee-e61f-46de-954e-71ce1cb8accc", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 99.05, 83, 251, 87.0, 131.10000000000005, 245.14999999999992, 251.0, 0.10716046207591247, 0.08696322654793287, 0.03809219550354701], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a3a550b-54dc-491c-ad08-02d63943eb61", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 1.5352689302884617, 2.86865234375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 439.75, 168, 1270, 335.5, 1231.6000000000001, 1270.0, 1270.0, 0.05769147560371725, 11.577685703451394, 0.1272893299615871], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f937d239-1964-49a7-a4da-00686cee74c8", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc1ba435-351e-4d17-9af5-51505d62685f", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 1.6292649872448979, 3.044284119897959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 243.42857142857142, 169, 360, 173.0, 349.0, 360.0, 360.0, 0.07145737312488196, 0.1107449718253786, 0.16070930694004218], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 89.61538461538463, 85, 97, 88.0, 96.6, 97.0, 97.0, 0.06192363386936971, 0.05134098159677235, 0.022011916727002513], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 117.44444444444444, 85, 283, 89.5, 256.00000000000006, 283.0, 283.0, 0.11140888919148093, 0.0864942059640892, 0.039602378579784235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 85.52631578947368, 83, 95, 85.0, 87.0, 95.0, 95.0, 0.0956186526828581, 0.07106034637856935, 0.04799608152245025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 126.89473684210527, 82, 249, 84.0, 248.0, 249.0, 249.0, 0.09561961510588614, 0.04070320992531604, 0.05368774030719059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 222.0, 83, 1056, 85.0, 909.0, 1056.0, 1056.0, 0.09553883905225471, 9.072094346489198, 0.05530213843577778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 170.10526315789474, 82, 494, 84.0, 482.0, 494.0, 494.0, 0.09553835865099838, 2.9800346829383577, 0.05539515953648811], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 23.529411764705884, 0.29828486204325133], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 11.764705882352942, 0.14914243102162567], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.07457121551081283], "isController": false}, {"data": ["401/Unauthorized", 10, 58.8235294117647, 0.7457121551081283], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1341, 17, "401/Unauthorized", 10, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
