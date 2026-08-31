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

    var data = {"OkPercent": 97.63719512195122, "KoPercent": 2.3628048780487805};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7545811518324608, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05263157894736842, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/578f6795-1e9b-4270-a31f-7902a600fba7"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d63d90cf-ec82-44cf-aecb-0b0bd1046253"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/84cabec9-6b14-4d0e-8620-8f46d85280af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04eac89c-ffd0-4186-b390-b70d01b204f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/df5a58fa-acb8-4479-8f6e-deafeb7cab41"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/549317d8-0f40-4d9a-9937-11de8d5e7f43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/602fd6f9-1ea4-4013-915c-658a6b0ab47b"], "isController": false}, {"data": [0.020833333333333332, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c56a542-b10d-42ba-af06-a6b1de348cbf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d63d90cf-ec82-44cf-aecb-0b0bd1046253"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/043c4338-6806-460f-8e64-d71557aba918"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21f24662-ef99-4bbd-8b0d-ff8142d7f682"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/85488153-2e5c-429b-a003-d4142714b8b1"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c1acb39a-c9f1-4d54-b7ad-6ecced7938df"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db166223-9c97-44a2-b135-d499928791a1"], "isController": false}, {"data": [0.1875, 500, 1500, "register"], "isController": true}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.38596491228070173, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=578f6795-1e9b-4270-a31f-7902a600fba7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84cabec9-6b14-4d0e-8620-8f46d85280af"], "isController": false}, {"data": [0.21818181818181817, 500, 1500, "addBook"], "isController": true}, {"data": [0.9824561403508771, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/229a191b-cd7b-4a22-810c-280315c0da45"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/04eac89c-ffd0-4186-b390-b70d01b204f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb9adb45-5cad-40d7-a535-30e15e05a33e"], "isController": false}, {"data": [0.8892215568862275, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85488153-2e5c-429b-a003-d4142714b8b1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/21f24662-ef99-4bbd-8b0d-ff8142d7f682"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2c56a542-b10d-42ba-af06-a6b1de348cbf"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1acb39a-c9f1-4d54-b7ad-6ecced7938df"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9047619047619048, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=602fd6f9-1ea4-4013-915c-658a6b0ab47b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df5a58fa-acb8-4479-8f6e-deafeb7cab41"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/db166223-9c97-44a2-b135-d499928791a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=549317d8-0f40-4d9a-9937-11de8d5e7f43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1312, 31, 2.3628048780487805, 410.6760670731707, 101, 4154, 126.0, 1132.5000000000002, 1354.2499999999986, 2071.8799999999974, 5.201106820902742, 771.665770785597, 3.805560163317529], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1861.7894736842102, 1307, 4613, 1809.0, 2257.2000000000003, 2367.4999999999995, 4613.0, 0.2630279594106328, 316.510622097175, 1.2933064215161485], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/578f6795-1e9b-4270-a31f-7902a600fba7", 3, 0, 0.0, 800.6666666666666, 204, 1667, 531.0, 1667.0, 1667.0, 1667.0, 0.05270462570931642, 0.033883996020800757, 0.03379821375239367], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 539.7142857142858, 117, 968, 529.0, 921.5, 968.0, 968.0, 0.10485399081778624, 0.020654831896584007, 0.07055117155610811], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 539.7142857142858, 117, 968, 529.0, 921.5, 968.0, 968.0, 0.10734302998704216, 0.02114513927758141, 0.07222592545026567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 133.2222222222222, 101, 328, 110.0, 323.5, 328.0, 328.0, 0.08116224332440548, 0.03526189477766054, 0.04553046853159466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 112.0, 103, 118, 112.0, 117.1, 118.0, 118.0, 0.08115931573679133, 0.060314686792674016, 0.04073817215694408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 223.11111111111111, 106, 973, 111.0, 853.3000000000002, 973.0, 973.0, 0.081159681673693, 2.670960192303357, 0.04701731124737922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 228.00000000000003, 105, 1210, 110.0, 1141.6000000000001, 1210.0, 1210.0, 0.08116260928770792, 8.133918375778373, 0.04693974690793004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d63d90cf-ec82-44cf-aecb-0b0bd1046253", 3, 0, 0.0, 352.0, 256, 498, 302.0, 498.0, 498.0, 498.0, 0.02729654971611588, 0.02737652007661232, 0.017504623353108168], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 294.3571428571429, 111, 1291, 223.5, 804.0, 1291.0, 1291.0, 0.10539232292207744, 0.16566061695913037, 0.06811978684402689], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 136.23529411764707, 104, 329, 112.0, 319.4, 329.0, 329.0, 0.09545574503208998, 0.07093927926701218, 0.04791430951806079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 171.88235294117646, 105, 331, 110.0, 326.2, 331.0, 331.0, 0.09545574503208998, 0.033975401896761806, 0.05396802864233856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 809.1111111111111, 652, 902, 836.0, 902.0, 902.0, 902.0, 0.07042088213891694, 20.706077542193846, 0.04016190934485106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1165.7777777777778, 855, 1398, 1191.0, 1398.0, 1398.0, 1398.0, 0.07012513440650761, 63.09871920581337, 0.03992475913964252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 204.55555555555554, 107, 330, 115.0, 330.0, 330.0, 330.0, 0.07059930969563853, 0.12492768473486036, 0.03909160995842485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 117.66666666666667, 109, 160, 113.0, 160.0, 160.0, 160.0, 0.048815412652954956, 0.036277860379783915, 0.024503048929315284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 135.33333333333334, 107, 334, 111.0, 334.0, 334.0, 334.0, 0.04881567742600357, 0.013062007436254863, 0.027840191032017663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 184.77777777777777, 107, 336, 112.0, 336.0, 336.0, 336.0, 0.04875617578226576, 0.013141313003813816, 0.028663298653246076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 132.66666666666666, 108, 313, 111.0, 313.0, 313.0, 313.0, 0.04876225151569332, 0.013142950603839215, 0.028714489906213937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84cabec9-6b14-4d0e-8620-8f46d85280af", 3, 0, 0.0, 344.0, 220, 445, 367.0, 445.0, 445.0, 445.0, 0.01671653767071764, 0.02304509669123998, 0.01071991510784953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 163.0, 109, 345, 113.0, 345.0, 345.0, 345.0, 0.07071802366696525, 0.052555093760313046, 0.039709827742680684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 809.1764705882351, 105, 1481, 1072.0, 1466.6, 1481.0, 1481.0, 0.09163432514014662, 48.51177391588508, 0.049238710785899094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 183.11764705882354, 102, 1337, 112.0, 360.19999999999914, 1337.0, 1337.0, 0.09545467306774474, 5.076584170316404, 0.05563436999915775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 553.8823529411765, 102, 1014, 617.0, 1010.0, 1014.0, 1014.0, 0.09163234945343998, 15.858965686380198, 0.0493271338883379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 217.11764705882354, 105, 628, 111.0, 395.9999999999998, 628.0, 628.0, 0.09545520904690781, 1.675214791767269, 0.0557279003644143], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 411.7857142857142, 112, 775, 459.0, 699.0, 775.0, 775.0, 0.10736113986855929, 0.021148706681697226, 0.07292709124163158], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04eac89c-ffd0-4186-b390-b70d01b204f1", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 304.3333333333333, 224, 450, 227.0, 450.0, 450.0, 450.0, 0.0487263474188571, 0.07551632163449824, 0.10958669736877723], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 647.4583333333335, 125, 2051, 527.0, 1495.5, 1986.75, 2051.0, 0.11166010663540184, 0.06858809284537867, 0.05048694274628032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 124.88235294117646, 104, 319, 114.0, 162.19999999999987, 319.0, 319.0, 0.09163531301544862, 0.06810007148901993, 0.04599663172845762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df5a58fa-acb8-4479-8f6e-deafeb7cab41", 3, 0, 0.0, 407.0, 317, 476, 428.0, 476.0, 476.0, 476.0, 0.038842493688094774, 0.02497198080533437, 0.024908760600763902], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/549317d8-0f40-4d9a-9937-11de8d5e7f43", 3, 0, 0.0, 443.3333333333333, 209, 705, 416.0, 705.0, 705.0, 705.0, 0.06970260223048327, 0.0315386123373606, 0.04469860885223048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 176.11764705882354, 105, 336, 114.0, 334.4, 336.0, 336.0, 0.09163481907513515, 0.10547900417207941, 0.04773348686657431], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/602fd6f9-1ea4-4013-915c-658a6b0ab47b", 3, 0, 0.0, 399.3333333333333, 231, 495, 472.0, 495.0, 495.0, 495.0, 0.01925421988319107, 0.02654349648610487, 0.012347269912072396], "isController": false}, {"data": ["login", 24, 0, 0.0, 3329.5, 1319, 5168, 3333.5, 4739.5, 5163.75, 5168.0, 0.10827197921177999, 48.7182537886734, 0.23068592836455176], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c56a542-b10d-42ba-af06-a6b1de348cbf", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d63d90cf-ec82-44cf-aecb-0b0bd1046253", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 117.6470588235294, 105, 141, 115.0, 135.4, 141.0, 141.0, 0.09397041590200544, 0.07607565896754152, 0.033403546277666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/043c4338-6806-460f-8e64-d71557aba918", 1, 0, 0.0, 306.0, 306, 306, 306.0, 306.0, 306.0, 306.0, 3.2679738562091503, 1.0435814950980393, 1.9499336192810457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21f24662-ef99-4bbd-8b0d-ff8142d7f682", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.5345090606508875, 2.0398021449704142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85488153-2e5c-429b-a003-d4142714b8b1", 3, 0, 0.0, 298.3333333333333, 209, 446, 240.0, 446.0, 446.0, 446.0, 0.04498965237995261, 0.028924011539845834, 0.02885078619417534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 936.882352941176, 213, 1596, 1190.0, 1577.6, 1596.0, 1596.0, 0.09157805143454324, 64.50502168413384, 0.19217818226995056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1acb39a-c9f1-4d54-b7ad-6ecced7938df", 3, 0, 0.0, 440.0, 208, 601, 511.0, 601.0, 601.0, 601.0, 0.03293446042375672, 0.02676996994730486, 0.0211200804149742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 367.66666666666663, 216, 1324, 228.0, 1246.6000000000001, 1324.0, 1324.0, 0.08111725499209108, 10.894462789712529, 0.18012853986687757], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 4, 30.76923076923077, 959.0, 111, 1744, 1194.0, 1708.0, 1744.0, 1744.0, 0.10120039234613648, 83.82661429222003, 0.17861352299973532], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db166223-9c97-44a2-b135-d499928791a1", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["register", 24, 9, 37.5, 1113.0416666666663, 143, 2463, 1090.5, 1747.0, 2286.0, 2463.0, 0.11198469542495859, 0.03483117723911065, 0.05052434500618249], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 422.3529411764706, 222, 1655, 416.0, 846.1999999999992, 1655.0, 1655.0, 0.09539628740095621, 6.852509097719468, 0.21311271948160534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 115.61904761904763, 105, 127, 115.0, 121.0, 126.39999999999999, 127.0, 0.1545253863134658, 0.11996843956953641, 0.05492894591611479], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 370.58823529411757, 211, 1183, 228.0, 774.9999999999997, 1183.0, 1183.0, 0.10242506401566501, 7.3574003991565, 0.22881481586082242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 132.0, 110, 308, 112.0, 289.00000000000006, 308.0, 308.0, 0.044006336912515404, 0.03270392811564865, 0.022089118333039958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 129.10000000000002, 107, 308, 108.5, 288.50000000000006, 308.0, 308.0, 0.04400653056913646, 0.011775184937444717, 0.025097474465210635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 153.3, 103, 328, 111.0, 327.6, 328.0, 328.0, 0.044006336912515404, 0.011861082995951417, 0.025870912911459248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 152.70000000000002, 103, 335, 110.0, 333.1, 335.0, 335.0, 0.044006336912515404, 0.011861082995951417, 0.025913887849850378], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 115.0, 112, 118, 115.0, 118.0, 118.0, 118.0, 0.16663889351774705, 0.0491454549241793, 0.10301017538743543], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1291.1403508771928, 856, 4154, 1140.0, 1768.0, 1874.4999999999993, 4154.0, 0.2533378371171043, 303.08012767449196, 0.5002432682136572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 1113.0416666666663, 143, 2463, 1090.5, 1747.0, 2286.0, 2463.0, 0.108949769616633, 0.03388720861611095, 0.04915507183875434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 252.0, 113, 327, 316.0, 327.0, 327.0, 327.0, 0.014217874712088038, 0.0038321615434924786, 0.008372439893934654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=578f6795-1e9b-4270-a31f-7902a600fba7", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 178.0, 105, 319, 110.0, 319.0, 319.0, 319.0, 0.014217672567000782, 0.0038321070590744298, 0.008358436411459445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 21, 0, 0.0, 203.00000000000003, 103, 981, 111.0, 337.4, 916.799999999999, 981.0, 0.14677616634632185, 6.326698464529094, 0.08568768565437708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 21, 0, 0.0, 196.90476190476187, 103, 862, 112.0, 335.4, 809.3999999999992, 862.0, 0.146571279008899, 2.0898539740010467, 0.08571120877682778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 183.33333333333334, 107, 326, 117.0, 326.0, 326.0, 326.0, 0.014231971649912474, 0.003808164289136736, 0.008116671331590707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 21, 0, 0.0, 143.23809523809524, 106, 330, 113.0, 328.6, 329.9, 330.0, 0.14655286720216618, 0.10891282416098483, 0.07356266966983732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 109.33333333333333, 106, 113, 109.0, 113.0, 113.0, 113.0, 0.014231499051233396, 0.010576338650379507, 0.007143545422201138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 21, 0, 0.0, 160.0, 104, 344, 110.0, 334.8, 343.4, 344.0, 0.1465733250507772, 0.04970297090170514, 0.08300641520035178], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 122.33333333333333, 112, 139, 116.0, 139.0, 139.0, 139.0, 0.013539128080151638, 0.010656774641213106, 0.004812736934741402], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 480.64285714285717, 111, 1129, 471.0, 865.0, 1129.0, 1129.0, 0.10727804937855359, 0.02071328408760019, 0.07300534666135385], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1711.2916666666667, 888, 2912, 1527.5, 2776.0, 2901.0, 2912.0, 0.11349932609775129, 0.05874476839043768, 0.0522052564375399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 364.3333333333333, 231, 434, 428.0, 434.0, 434.0, 434.0, 0.014209995310701547, 0.022022717341878276, 0.031958612500532876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84cabec9-6b14-4d0e-8620-8f46d85280af", 1, 0, 0.0, 623.0, 623, 623, 623.0, 623.0, 623.0, 623.0, 1.6051364365971108, 0.2899904695024077, 1.1066663322632424], "isController": false}, {"data": ["addBook", 55, 14, 25.454545454545453, 1203.018181818182, 548, 3161, 945.0, 2102.7999999999997, 2444.3999999999983, 3161.0, 0.2597341267030294, 85.82770791274115, 0.941328680255484], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 236.0701754385965, 106, 2905, 115.0, 454.2, 464.59999999999985, 2905.0, 0.25441658260504724, 0.18907326109613376, 0.12298457850536952], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 706.105263157895, 521, 1033, 651.0, 916.6, 987.8, 1033.0, 0.254374573253183, 74.79457056718836, 0.12793252463416918], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 155.85964912280699, 103, 371, 114.0, 326.4, 341.59999999999997, 371.0, 0.2548556712093572, 0.4509750744446829, 0.12394348072486318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/229a191b-cd7b-4a22-810c-280315c0da45", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 1.5134404620853081, 2.827865817535545], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1048.2280701754378, 740, 1528, 1010.0, 1321.6, 1369.9999999999995, 1528.0, 0.2539009429970111, 228.46051481896194, 0.12744637177779658], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04eac89c-ffd0-4186-b390-b70d01b204f1", 3, 0, 0.0, 1418.6666666666667, 418, 2547, 1291.0, 2547.0, 2547.0, 2547.0, 0.030787229457221142, 0.025666046432273226, 0.019743112640210173], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 155.6470588235294, 110, 347, 116.0, 343.8, 347.0, 347.0, 0.10347934065398944, 0.07730634335966985, 0.036783671873097806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb9adb45-5cad-40d7-a535-30e15e05a33e", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 1.3087538422131149, 2.445408555327869], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 14, 8.383233532934131, 200.10778443113773, 105, 2289, 120.0, 334.0, 463.7999999999999, 1764.0399999999947, 0.6867962394821474, 1.5998310512095018, 0.325638640822017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 114.7, 110, 129, 112.5, 128.2, 129.0, 129.0, 0.04586861394222389, 0.035521299664241744, 0.0163048588622749], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85488153-2e5c-429b-a003-d4142714b8b1", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.3163994089316988, 1.207448555166375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 127.61111111111111, 107, 334, 115.5, 143.2000000000003, 334.0, 334.0, 0.08208308632404578, 0.06661234837429887, 0.029177972091750652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21f24662-ef99-4bbd-8b0d-ff8142d7f682", 3, 0, 0.0, 339.0, 190, 600, 227.0, 600.0, 600.0, 600.0, 0.08001920460910618, 0.036206606252167185, 0.0513143987890427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c56a542-b10d-42ba-af06-a6b1de348cbf", 3, 0, 0.0, 1163.3333333333333, 249, 2771, 470.0, 2771.0, 2771.0, 2771.0, 0.07637085688101419, 0.034555823914260986, 0.04897480079934831], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1acb39a-c9f1-4d54-b7ad-6ecced7938df", 1, 0, 0.0, 775.0, 775, 775, 775.0, 775.0, 775.0, 775.0, 1.2903225806451613, 0.2331149193548387, 0.889616935483871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 308.79999999999995, 219, 625, 228.0, 607.3000000000001, 625.0, 625.0, 0.04398465815123685, 0.06816762938087195, 0.0989225270725571], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 0, 0.0, 390.42857142857144, 213, 1093, 231.0, 668.6, 1051.0999999999995, 1093.0, 0.14623751758332057, 8.546843010543029, 0.32710987877954345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=602fd6f9-1ea4-4013-915c-658a6b0ab47b", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 142.22222222222223, 114, 346, 117.0, 346.0, 346.0, 346.0, 0.049448375895565035, 0.0409977257181003, 0.01757735236912663], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df5a58fa-acb8-4479-8f6e-deafeb7cab41", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 115.6470588235294, 105, 128, 116.0, 122.39999999999999, 128.0, 128.0, 0.09172876344231069, 0.07121520208655957, 0.03260670887988388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db166223-9c97-44a2-b135-d499928791a1", 3, 0, 0.0, 567.6666666666667, 227, 1129, 347.0, 1129.0, 1129.0, 1129.0, 0.11667703795892968, 0.05416063025046671, 0.07482218905569384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=549317d8-0f40-4d9a-9937-11de8d5e7f43", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 0.7993985066371682, 3.0506775442477876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 123.76470588235294, 104, 337, 111.0, 159.39999999999984, 337.0, 337.0, 0.10249608103219582, 0.07617140397021584, 0.05144822817436392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 159.76470588235293, 103, 334, 111.0, 323.59999999999997, 334.0, 334.0, 0.10249608103219582, 0.03648125678282889, 0.05794843919570722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 203.94117647058823, 106, 1067, 109.0, 485.3999999999995, 1067.0, 1067.0, 0.1024997889710227, 5.451265919498474, 0.05974051349379574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 201.00000000000003, 104, 994, 110.0, 469.19999999999953, 994.0, 994.0, 0.1025004069869101, 1.7988562348887267, 0.059840971749079], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 29.032258064516128, 0.6859756097560976], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.451612903225806, 0.1524390243902439], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.451612903225806, 0.1524390243902439], "isController": false}, {"data": ["401/Unauthorized", 18, 58.064516129032256, 1.3719512195121952], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1312, 31, "401/Unauthorized", 18, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
